import llm from '../utils/llm';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { CallbackManager } from '@langchain/core/callbacks/manager';
import {
    ChatPromptTemplate,
} from '@langchain/core/prompts';

// Tool Configuration Interfaces
export interface ToolConfig {
    name: string;
    promptTemplate: ChatPromptTemplate;
    formatInitialInput: (data: any) => string;
    formatFollowupInput: (followup: string) => string;
}

// Conversation Chain Storage
const conversationChains = new Map<string, ConversationChain>();

// Helper to generate a composite key.
const getConversationKey = (userId: string): string => `${userId}`;

/**
 * Extracts only the text after the last </think> tag.
 */
const filterAfterThink = (text: string): string => {
    const lastThinkIndex = text.lastIndexOf('</think>');
    if (lastThinkIndex !== -1) {
        return text.substring(lastThinkIndex + '</think>'.length).trim();
    }
    return text;
};

/**
 * Extracts only the latest turn from the conversation history.
 * This assumes that the conversation contains multiple turns,
 * and we only want the most recent output.
 */
const getLatestTurn = (history: string): string => {
    // First, remove any internal AI thoughts.
    const filteredText = filterAfterThink(history);
    // Split by a marker that separates turns. In your example,
    // the repeated output is introduced by the repeated 'Human:' marker.
    // We split by 'Human:' and take the last segment.
    const parts = filteredText.split('Human:');
    return parts[parts.length - 1].trim();
};

// Generic Function to Run a Tool's Initial Request
export const runToolInitial = async (
    userId: string,
    toolConfig: ToolConfig,
    inputData: any,
    sendChunk: (chunk: string) => void
): Promise<void> => {
    console.log(`🔹 Received initial request for ${toolConfig.name} from user: ${userId}`);

    const initialInput = toolConfig.formatInitialInput(inputData);
    console.log(`🔹 Formatted initial input:`, initialInput);

    const conversation = new ConversationChain({
        llm,
        memory: new BufferMemory({ memoryKey: 'history' }),
        prompt: toolConfig.promptTemplate,
    });

    const convKey = getConversationKey(userId);

    try {
        const fullPrompt = await toolConfig.promptTemplate.format({
            history: '',
            input: initialInput,
        });
        console.log(`🔹 Full prompt generated for ${toolConfig.name}:`, fullPrompt);

        let fullResponse = '';
        const callbackManager = CallbackManager.fromHandlers({
            handleLLMNewToken: (token: string) => {
                sendChunk(token);
                fullResponse += token;
            },
        });

        await conversation.call({ input: fullPrompt }, { callbacks: callbackManager });

        // Save only the newsletter output (text after </think>)
        const storedResponse = filterAfterThink(fullResponse);

        await conversation.memory.saveContext(
            { input: initialInput },
            { response: storedResponse }
        );

        conversationChains.set(convKey, conversation);
        console.log(`✅ Stored conversation for key: ${convKey}`);
    } catch (error) {
        console.error(`❌ Error generating ${toolConfig.name}:`, error);
        throw new Error(`Failed to stream ${toolConfig.name}.`);
    }
};

// Generic Function to Handle a Follow-Up
export const runToolFollowup = async (
    userId: string,
    toolConfig: ToolConfig,
    followup: string,
    sendChunk: (chunk: string) => void
): Promise<void> => {
    console.log(`🔹 Received follow-up request for ${toolConfig.name} from user: ${userId}`);

    const convKey = getConversationKey(userId);
    let conversation = conversationChains.get(convKey);

    if (!conversation) {
        conversation = new ConversationChain({
            llm,
            memory: new BufferMemory({ memoryKey: 'history' }),
            prompt: toolConfig.promptTemplate,
        });
        conversationChains.set(convKey, conversation);
    }

    const wrappedFollowupInput = toolConfig.formatFollowupInput(followup);
    console.log(`🔹 Wrapped follow-up input:`, wrappedFollowupInput);

    try {
        const memoryVars = await conversation.memory.loadMemoryVariables({});
        // Instead of using the entire history, get only the latest turn.
        const history = getLatestTurn(memoryVars.history || '');

        const fullPrompt = await toolConfig.promptTemplate.format({
            history,
            input: wrappedFollowupInput,
        });
        console.log(`🔹 Full follow-up prompt generated:`, fullPrompt);

        let fullResponse = '';
        const callbackManager = CallbackManager.fromHandlers({
            handleLLMNewToken: (token: string) => {
                sendChunk(token);
                fullResponse += token;
            },
        });

        await conversation.call({ input: fullPrompt }, { callbacks: callbackManager });

        // Extract and store only the text after the last </think> tag.
        const storedResponse = filterAfterThink(fullResponse);

        await conversation.memory.saveContext(
            { input: wrappedFollowupInput },
            { response: storedResponse }
        );

        console.log(`✅ Follow-up for ${toolConfig.name} complete.`);
    } catch (error) {
        console.error(`❌ Error processing follow-up for ${toolConfig.name}:`, error);
        throw new Error(`Failed to process follow-up for ${toolConfig.name}.`);
    }
};

// Clear Conversation Function
export const clearConversation = (userId: string): void => {
    const convKey = getConversationKey(userId);
    console.log(`🔹 Attempting to clear conversation for key: ${convKey}`);
    const isClosed = conversationChains.delete(convKey);
    if (isClosed) {
        console.log(`✅ Closed conversation for user ${userId}`);
    }
};

import llm from '../utils/llm';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { CallbackManager } from '@langchain/core/callbacks/manager';
import {
    ChatPromptTemplate,
} from '@langchain/core/prompts';

// ----- Tool Configuration Interfaces -----
export interface ToolConfig {
    name: string;
    promptTemplate: ChatPromptTemplate;
    formatInitialInput: (data: any) => string;
    formatFollowupInput: (followup: string) => string;
}

// ----- Conversation Chain Storage -----
// Composite key: `${userId}` ensures conversations for different tools/users are separate.
const conversationChains = new Map<string, ConversationChain>();

// Helper to generate a composite key.
const getConversationKey = (userId: string): string =>
    `${userId}`;

// ----- Generic Function to Run a Tool's Initial Request -----
export const runToolInitial = async (
    userId: string,
    toolConfig: ToolConfig,
    inputData: any,
    sendChunk: (chunk: string) => void
): Promise<void> => {
    const initialInput = toolConfig.formatInitialInput(inputData);

    const conversation = new ConversationChain({
        llm,
        memory: new BufferMemory({ memoryKey: 'history' }),
        prompt: toolConfig.promptTemplate,
    });

    const convKey = getConversationKey(userId);

    try {
        // For the initial call there is no history.
        const fullPrompt = await toolConfig.promptTemplate.format({
            history: '',
            input: initialInput,
        });
        console.log(
            `Formatted fullPrompt for tool ${toolConfig.name} initial generation:`,
            fullPrompt
        );

        let fullResponse = '';
        const callbackManager = CallbackManager.fromHandlers({
            handleLLMNewToken: (token: string) => {
                sendChunk(token);
                fullResponse += token;
            },
        });

        await conversation.call({ input: fullPrompt }, { callbacks: callbackManager });

        // Save the conversation round.
        await conversation.memory.saveContext(
            { input: initialInput },
            { response: fullResponse }
        );

        // Store conversation chain.
        conversationChains.set(convKey, conversation);
        console.log(`Storing conversation for key: ${convKey}`);
        console.log(`✅ Initial ${toolConfig.name} streaming complete.`);
    } catch (error) {
        console.error(`❌ Error generating ${toolConfig.name}:`, error);
        throw new Error(`Failed to stream ${toolConfig.name}.`);
    }
};

// ----- Generic Function to Handle a Follow-Up -----
export const runToolFollowup = async (
    userId: string,
    toolConfig: ToolConfig,
    followup: string,
    sendChunk: (chunk: string) => void
): Promise<void> => {
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
    console.log(`Wrapped follow-up prompt for ${toolConfig.name}:`, wrappedFollowupInput);

    try {
        const memoryVars = await conversation.memory.loadMemoryVariables({});
        const history = memoryVars.history || '';

        const fullPrompt = await toolConfig.promptTemplate.format({
            history,
            input: wrappedFollowupInput,
        });
        console.log(`Formatted fullPrompt for ${toolConfig.name} follow-up:`, fullPrompt);

        let fullResponse = '';
        const callbackManager = CallbackManager.fromHandlers({
            handleLLMNewToken: (token: string) => {
                sendChunk(token);
                fullResponse += token;
            },
        });

        await conversation.call({ input: fullPrompt }, { callbacks: callbackManager });

        await conversation.memory.saveContext(
            { input: wrappedFollowupInput },
            { response: fullResponse }
        );

        console.log(`✅ Follow-up for ${toolConfig.name} complete.`);
    } catch (error) {
        console.error(`❌ Error processing follow-up for ${toolConfig.name}:`, error);
        throw new Error(`Failed to process follow-up for ${toolConfig.name}.`);
    }
};

// ----- Clear Conversation Function -----
export const clearConversation = (userId: string): void => {
    const convKey = getConversationKey(userId);
    console.log(`Attempting to clear conversation for key: ${convKey}`);
    const isClosed = conversationChains.delete(convKey);
    if (isClosed) {
        console.log(`Closed conversation for user ${userId}`);
    }
};

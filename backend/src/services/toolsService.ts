// backend/toolsService.ts
import llm from '../utils/llm';
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
} from "@langchain/core/prompts";

// Create a custom prompt template that forces the LLM to return only the lesson plan.
const customPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are an expert educator and curriculum designer.
        Your task is to generate a highly detailed and structured lesson plan based on the provided details.
        Do not include any self-introductions, disclaimers, or additional commentary.
        Only output the lesson plan.`
    ),
    HumanMessagePromptTemplate.fromTemplate("{history}\n{input}")
]);

const conversationChains = new Map<string, ConversationChain>();

export const generateLessonPlan = async (
    lessonPlanData: {
        subject: string;
        gradeLevel: string;
        topic: string;
        learningObjectives: string;
        userId?: string;
    },
    sendChunk: (chunk: string) => void
): Promise<void> => {
    const initialPrompt = `
        Generate a highly detailed and structured lesson plan with the following requirements:
        
        Subject: ${lessonPlanData.subject}
        Grade Level: ${lessonPlanData.gradeLevel}
        Topic: ${lessonPlanData.topic}
        Learning Objectives: ${lessonPlanData.learningObjectives}
        
        Lesson Plan Format:
        1. Lesson Title
        2. Lesson Duration
        3. Lesson Overview
        4. Materials Needed
        5. Step-by-Step Lesson Procedure (Introduction → Main Activity → Assessment → Closing)
        6. Differentiation Strategies
        7. Homework/Extensions
        8. Teacher Notes & Tips
        
        Please generate the complete lesson plan in this order
    `;

    try {
        const conversation = new ConversationChain({
            llm,
            memory: new BufferMemory({ memoryKey: "history" }),
            prompt: customPrompt
        });

        // For an initial generation, if memory is not required, you can ignore it.
        // Log the full prompt to verify it contains your initial prompt.
        const fullPrompt = await customPrompt.format({ history: "", input: initialPrompt });
        console.log("Formatted fullPrompt for initial generation:", fullPrompt);

        // Prepare a callback manager to stream tokens.
        let fullResponse = "";
        const callbackManager = CallbackManager.fromHandlers({
            handleLLMNewToken: (token: string) => {
                sendChunk(token);
                fullResponse += token;
            },
        });

        // Call the conversation chain with the fully formatted prompt.
        await conversation.call({ input: fullPrompt }, { callbacks: callbackManager });

        // Save the conversation round (original prompt and full response) into memory.
        await conversation.memory.saveContext(
            { input: initialPrompt },
            { response: fullResponse }
        );

        // Store the conversation chain for future follow-ups if userId is provided.
        if (lessonPlanData.userId) {
            conversationChains.set(lessonPlanData.userId, conversation);
        }

        console.log("✅ Initial lesson plan streaming complete.");
    } catch (error) {
        console.error("❌ Error generating lesson plan:", error);
        throw new Error("Failed to stream lesson plan.");
    }
};

/**
 * Handles a follow-up prompt using a streaming callback.
 * Retrieves the existing ConversationChain (or creates a new one),
 * wraps the follow-up prompt so that the AI returns the entire updated lesson plan,
 * streams tokens to the client, and saves the new conversation round to memory.
 */
export const handleFollowUp = async (
    userId: string,
    followupPrompt: string,
    sendChunk: (chunk: string) => void
): Promise<void> => {
    try {

        let conversation = conversationChains.get(userId);
        if (!conversation) {
            conversation = new ConversationChain({
                llm,
                memory: new BufferMemory({ memoryKey: "history" }),
                prompt: customPrompt
            });
            conversationChains.set(userId, conversation);
        }

        // Wrap the follow-up prompt so the AI is instructed to update the complete lesson plan.
        const wrappedFollowupPrompt = `
            Please update the complete lesson plan from the previous conversation context to incorporate the following change:
            "${followupPrompt}"
            Return the entire updated lesson plan.
        `;

        // Log the wrapped prompt.
        console.log("Wrapped follow-up prompt:", wrappedFollowupPrompt);

        // Retrieve the current conversation history asynchronously
        const memoryVars = await conversation.memory.loadMemoryVariables({});
        const history = memoryVars.history || "";

        // Format the full prompt with both history and new input
        const fullPrompt = await customPrompt.format({
            history,
            input: wrappedFollowupPrompt
        });
        console.log("Formatted fullPrompt for follow-up:", fullPrompt);

        // Prepare a callback manager for streaming.
        let fullResponse = "";
        const callbackManager = CallbackManager.fromHandlers({
            handleLLMNewToken: (token: string) => {
                sendChunk(token);
                fullResponse += token;
            },
        });

        // Call the conversation chain with the fully formatted prompt.
        await conversation.call({ input: fullPrompt }, { callbacks: callbackManager });

        // Save the new round (wrapped prompt and full response) into memory.
        await conversation.memory.saveContext(
            { input: wrappedFollowupPrompt },
            { response: fullResponse }
        );

        console.log("✅ Follow-up streaming complete.");
    } catch (error) {
        console.error("❌ Error processing follow-up:", error);
        throw new Error("Failed to process follow-up question.");
    }
};

export const clearConversation = (userId: string): void => {
    const isClosed = conversationChains.delete(userId);
    if (isClosed) {
        console.log(`closed conversation for userid ${userId}`)
    }
};

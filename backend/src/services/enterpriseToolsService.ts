import llm from '../utils/llm';
import { getDocumentsFromVectorStore } from "../utils/vectorStore";

export const processQuery = async (school: string, subject: string, question: string): Promise<string> => {
    const context = await getDocumentsFromVectorStore(school, subject, question);

    const prompt = `
        Answer the following question using the provided context.
        Provide only the final answer without showing your reasoning.
        
        Context:
        ${context}
        
        Question: ${question}
    `;

    const response = await llm._call(prompt, {});
    console.log("LLM Response:", response);
    return response;

    // function extractFinalAnswer(response: string): string {
    //     // Remove chain-of-thought markers if present
    //     return response.replace(/<think>.*<\/think>/s, '').trim();
    // }
    // const rawResponse = await llm._call(prompt, {});
    // console.log("Raw response:", rawResponse);
    // const finalAnswer = extractFinalAnswer(rawResponse);
    // console.log("Final answer:", finalAnswer);
    // return finalAnswer;

    // todo: this is the correct one
    // Get the answer from the LLM


    // todo: this is the correct one for streams
    // Get the answer from the LLM
    // let fullResponse = "";
    // for await (const chunk of llm._streamResponseChunks(prompt, {})) {
    //     fullResponse += chunk.text;
    // }
    // console.log("Full streamed response:", fullResponse);
    // return fullResponse;

};

//todo implement buffer functionality for chat capability

// How This Works
// ConversationChain & BufferMemory:
// The ConversationChain is set up with a BufferMemory that automatically appends previous interactions to the new prompt. This means the chain remembers the context and the responses you’ve received.
//
//     LLM Configuration:
//     The Ollama instance is configured with parameters like temperature and num_predict to control its behavior. A low temperature helps ensure that the output is deterministic—ideal for arithmetic or factual questions.
//
//     Follow-Up Questions:
//     When you call conversation.call() for the follow-up, the conversation history (stored in memory) is included in the prompt, so the LLM is aware of what came before.
//
//     By using this setup, you only need to ask your answer once. The follow-up questions build upon that conversation, ensuring a smooth, continuous chat session.

// import { ConversationChain } from "@langchain/chains";
// import { BufferMemory } from "@langchain/memory";
// import { Ollama } from "@langchain/ollama";
//
// // Initialize your Ollama LLM
// const ollama = new Ollama({
//     baseUrl: "http://localhost:11434",
//     model: "deepseek-r1:1.5b",
//     temperature: 0,      // Deterministic output for arithmetic questions
//     num_predict: 1000,   // Max tokens
// });
//
// // Create a conversation chain with memory
// const conversation = new ConversationChain({
//     llm: ollama,
//     memory: new BufferMemory({ memoryKey: "chat_history" }),
// });
//
// async function runConversation() {
//     // First question using the context
//     const firstPrompt = `
//     Answer the following question using the provided context.
//
//     Context:
//     1739871971439
//
//     Question: what is the last digit of the given context?
//   `;
//     const firstResponse = await conversation.call({ input: firstPrompt });
//     console.log("Answer 1:", firstResponse);
//
//     // Follow-up question: since the conversation memory keeps the previous context,
//     // you can ask a follow-up like:
//     const followupPrompt = "what is the 1st digit?";
//     const followupResponse = await conversation.call({ input: followupPrompt });
//     console.log("Follow-up Answer:", followupResponse);
// }
//
// runConversation();




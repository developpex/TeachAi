import llm from '../utils/llm';

export const generateLessonPlan = async (
  lessonPlanData: {
    subject: string;
    gradeLevel: string;
    topic: string;
    learningObjectives: string;
  },
  sendChunk: (chunk: string) => void
): Promise<void> => {
  const prompt = `
    You are an expert educator and curriculum designer. Your task is to generate a highly detailed and structured lesson plan.

    ## **Lesson Plan Requirements**
    - **Subject**: ${lessonPlanData.subject}
    - **Grade Level**: ${lessonPlanData.gradeLevel}
    - **Topic**: ${lessonPlanData.topic}
    - **Learning Objectives**: ${lessonPlanData.learningObjectives}

    ## **Lesson Plan Format**
    1. **Lesson Title**
    2. **Lesson Duration**
    3. **Lesson Overview**
    4. **Materials Needed**
    5. **Step-by-Step Lesson Procedure** (Introduction → Main Activity → Assessment → Closing)
    6. **Differentiation Strategies**
    7. **Homework/Extensions**
    8. **Teacher Notes & Tips**

    ### **Now generate a complete lesson plan based on the given details.**
  `;

  console.log("prompt", prompt)

  console.log("🤖 Streaming AI response for prompt...");

  try {
    //const stream = await llm.stream(prompt, {});

      for await (const chunk of llm._streamResponseChunks(prompt, {})) {
          sendChunk(chunk.text); // Ensure chunk.text exists
      }

    console.log("✅ Streaming complete.");
  } catch (error) {
    console.error("❌ Error in streaming lesson plan:", error);
    throw new Error("Failed to stream lesson plan.");
  }
};
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




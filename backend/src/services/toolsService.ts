import {Document} from 'langchain/document';
import {OllamaLLM} from '../utils/llm';
import {getVectorStore} from "../utils/vectorStore";

/**
 * Processes a query by:
 *  1. Filtering documents from the vector store based on metadata.
 *  2. Grouping and merging document chunks.
 *  3. Constructing a prompt and using the custom LLM (Ollama) to generate an answer.
 */
export const processQuery = async (school: string, course: string, question: string): Promise<string> => {
    // Retrieve the vector store instance
    //const vectorStore = await getVectorStore();
    const vectorStore = await getVectorStore(school);
    console.log('vectorstore', vectorStore);

    // Create a retriever filtering by school and course metadata
    const retriever = vectorStore.asRetriever(10, {
        course: { $eq: course }
    });

    // Retrieve relevant document chunks
    const docs: Document[] = await retriever.getRelevantDocuments(question);
    console.log('retrieved docs', docs);

    // Group retrieved documents by PDF id
    const groupedDocs: { [key: string]: Document[] } = {};
    docs.forEach(doc => {
        const pdfId = doc.metadata.pdfId || 'default';
        if (!groupedDocs[pdfId]) {
            groupedDocs[pdfId] = [];
        }
        groupedDocs[pdfId].push(doc);
    });
    //console.log('groupedDocs', groupedDocs);

    // Stitch chunks together for each PDF by sorting by chunkIndex and concatenating text
    const mergedDocs = Object.values(groupedDocs).map(group => {
        group.sort((a, b) => (a.metadata.chunkIndex || 0) - (b.metadata.chunkIndex || 0));
        return new Document({
            pageContent: group.map(doc => doc.pageContent).join('\n'),
            metadata: group[0].metadata, // Use metadata from the first chunk
        });
    });
    console.log('mergedDocs', mergedDocs);

    // Concatenate merged document texts as the context for the LLM
    const context = mergedDocs.map(doc => doc.pageContent).join('\n\n');
    //console.log('context', context);

    // Construct the prompt with the provided question and the retrieved context
    const prompt = `
    Answer the following question using the provided context.
    
    Context:
    ${context}
    
    Question: ${question}
  `;

    // Initialize your custom LLM (using Ollama deepseek)
    const llm = new OllamaLLM({
        model: 'deepseek-r1:1.5b',
        endpoint: 'http://localhost:11434/api/generate',
        maxTokens: 1000,
    });

    // Get the answer from the LLM
    return await llm._call(prompt, {});
};

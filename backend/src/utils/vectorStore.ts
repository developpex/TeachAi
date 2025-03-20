import { Chroma } from "@langchain/community/vectorstores/chroma";
import {OllamaEmbeddings} from "@langchain/ollama";
import { Document } from "langchain/document";

// Use a simple in-memory map to cache stores by school.
const stores: { [school: string]: Chroma } = {};

export async function getVectorStore(school: string): Promise<Chroma> {
    console.log(`Getting vector store for school: ${school}`);

    // Normalize the school name: lowercase, remove special characters, replace spaces with underscores
    const normalizedSchool = school
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_'); // Replace non-alphanumeric characters with '_'

    const collectionName = `${normalizedSchool}_documents`;
    console.log(`Normalized school name: ${normalizedSchool}, Collection name: ${collectionName}`);

    // Return a cached store if it exists
    if (stores[normalizedSchool]) {
        console.log(`Returning cached vector store for school: ${normalizedSchool}`);
        return stores[normalizedSchool];
    }

    const embeddings = new OllamaEmbeddings({
        baseUrl: 'http://localhost:11434',
        model: 'nomic-embed-text'
    });

    try {
        console.log(`Attempting to retrieve existing collection: ${collectionName}`);
        stores[normalizedSchool] = await Chroma.fromExistingCollection(embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
        console.log(`Successfully retrieved existing collection: ${collectionName}`);
    } catch (error) {
        console.error(error);
        console.warn(`Collection ${collectionName} not found. Creating a new one.`);
        stores[normalizedSchool] = await Chroma.fromDocuments([], embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
    }

    console.log(`Vector store ready for school: ${normalizedSchool}`);
    return stores[normalizedSchool];
}

export async function getDocumentsFromVectorStore(
    school: string,
    subject: string,
    question: string
): Promise<string> {
    // Retrieve the vector store instance for the school
    const vectorStore = await getVectorStore(school);
    console.log('vectorstore', vectorStore);

    // Create a retriever filtering by subject metadata
    // const retriever = vectorStore.asRetriever(10, {
    //     subject: { $eq: subject }
    // });

    const retriever = vectorStore.asRetriever({
        k: 5,
        filter: {
            subject: { $eq: subject }
        },
        searchType: 'similarity', // or 'similarity'
    });

    // Retrieve relevant document chunks (using _getRelevantDocuments if needed)
    const docs: Document[] = await retriever._getRelevantDocuments(question);
    console.log('retrieved docs', docs);

    // Process the documents to create a single context string
    const context = prepareContextFromDocuments(docs);
    console.log('Merged Context:', context);
    return context;
}

export function prepareContextFromDocuments(docs: Document[]): string {
    // Group documents by pdf id
    const groupedDocs: { [key: string]: Document[] } = {};
    docs.forEach(doc => {
        const pdfId = doc.metadata.pdfId || 'default';
        if (!groupedDocs[pdfId]) {
            groupedDocs[pdfId] = [];
        }
        groupedDocs[pdfId].push(doc);
    });

    // Merge documents: sort by chunkIndex and concatenate text
    const mergedDocs = Object.values(groupedDocs).map(group => {
        group.sort((a, b) => (a.metadata.chunkIndex || 0) - (b.metadata.chunkIndex || 0));
        return new Document({
            pageContent: group.map(doc => doc.pageContent).join('\n'),
            metadata: group[0].metadata, // Use metadata from the first chunk
        });
    });

    // Construct the final context by joining the merged documents
    return mergedDocs.map(doc => doc.pageContent).join('\n\n');
}
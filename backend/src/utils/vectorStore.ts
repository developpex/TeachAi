import {Chroma} from "@langchain/community/vectorstores/chroma";
import {OllamaEmbeddings} from "@langchain/ollama";
import {Document} from "langchain/document";

const stores: { [school: string]: Chroma } = {};

export async function getVectorStore(school: string): Promise<Chroma> {
    const collectionName = `${school}_documents`;

    if (stores[school]) {
        console.log(`Returning cached vector store for school: ${school}`);
        return stores[school];
    }

    const embeddings = new OllamaEmbeddings({
        baseUrl: 'http://localhost:11434',
        model: 'nomic-embed-text'
    });

    try {
        console.log(`Attempting to retrieve existing collection: ${collectionName}`);
        stores[school] = await Chroma.fromExistingCollection(embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
        console.log(`Successfully retrieved existing collection: ${collectionName}`);
    } catch (error) {
        console.error(error);
        console.warn(`Collection ${collectionName} not found. Creating a new one.`);
        stores[school] = await Chroma.fromDocuments([], embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
    }

    console.log(`Vector store ready for school: ${school}`);
    return stores[school];
}

export async function getDocumentsFromVectorStore(
    school: string,
    subject: string,
    question: string
): Promise<string> {
    const vectorStore = await getVectorStore(school);

    const retriever = vectorStore.asRetriever({
        k: 5,
        filter: {
            subject: { $eq: subject }
        },
        searchType: 'similarity', // or 'similarity'
    });

    const docs: Document[] = await retriever._getRelevantDocuments(question);

    return prepareContextFromDocuments(docs);
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
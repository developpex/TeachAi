import { Chroma } from 'langchain/vectorstores/chroma';
import { OllamaEmbeddings } from './embeddings';

// Use a simple in-memory map to cache stores by school.
const stores: { [school: string]: Chroma } = {};

/**
 * Retrieves (or creates) a vector store (collection) for a given school.
 * The collection name is dynamically built based on the school name.
 *
 * @param school - A string identifier for the school.
 * @returns A Promise that resolves to a Chroma vector store for that school.
 */
export async function getVectorStore(school: string): Promise<Chroma> {
    // Normalize the school string if needed (e.g., remove spaces or special characters)
    const collectionName = `school_docs_${school.toLowerCase()}`;

    // Return a cached store if it exists
    if (stores[school]) {
        return stores[school];
    }

    const embeddings = new OllamaEmbeddings(
        'http://localhost:11434/api/embeddings',
        'nomic-embed-text'
    );

    try {
        // Try to retrieve an existing collection
        stores[school] = await Chroma.fromExistingCollection(embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
    } catch (error) {
        // If it doesn't exist, create a new one with no documents
        stores[school] = await Chroma.fromDocuments([], embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
    }

    return stores[school];
}

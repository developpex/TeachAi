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
    // Normalize the school name: lowercase, remove special characters, replace spaces with underscores
    const normalizedSchool = school
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_'); // Replace non-alphanumeric characters with '_'

    const collectionName = `${normalizedSchool}_documents`;

    // Return a cached store if it exists
    if (stores[normalizedSchool]) {
        return stores[normalizedSchool];
    }

    const embeddings = new OllamaEmbeddings(
        'http://localhost:11434/api/embeddings',
        'nomic-embed-text'
    );

    try {
        // Try to retrieve an existing collection
        stores[normalizedSchool] = await Chroma.fromExistingCollection(embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
    } catch (error) {
        // If it doesn't exist, create a new one with no documents
        stores[normalizedSchool] = await Chroma.fromDocuments([], embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
    }

    return stores[normalizedSchool];
}


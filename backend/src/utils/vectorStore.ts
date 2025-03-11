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

    const embeddings = new OllamaEmbeddings(
        'http://localhost:11434/api/embeddings',
        'nomic-embed-text'
    );

    try {
        console.log(`Attempting to retrieve existing collection: ${collectionName}`);
        stores[normalizedSchool] = await Chroma.fromExistingCollection(embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
        console.log(`Successfully retrieved existing collection: ${collectionName}`);
    } catch (error) {
        console.warn(`Collection ${collectionName} not found. Creating a new one.`);
        stores[normalizedSchool] = await Chroma.fromDocuments([], embeddings, {
            collectionName,
            url: 'http://localhost:8000',
        });
    }

    console.log(`Vector store ready for school: ${normalizedSchool}`);
    return stores[normalizedSchool];
}
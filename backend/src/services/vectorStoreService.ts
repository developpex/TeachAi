import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from 'langchain/document';
import { getVectorStore } from '../utils/vectorStore';
import { v4 as uuidv4 } from 'uuid';
import {GenericTextExtractor} from "../utils/GenericTextExtractor";

export const uploadPDFService = async (
    filePath: string,
    school: string,
    subject: string
): Promise<string> => {
    console.log(`Starting upload for file: ${filePath}, school: ${school}, subject: ${subject}`);

    // Generate a unique file ID
    const fileId = uuidv4();
    console.log(`Generated fileId: ${fileId}`);

    try {
        // Load the PDF
        console.log('Loading PDF file...');
        const loader = new PDFLoader(filePath);
        const docs: Document[] = await loader.load();
        console.log(`Loaded ${docs.length} documents from PDF`);

        // Use the generic extractor to process each document
        const extractor = new GenericTextExtractor();
        const processedDocs: Document[] = [];
        for (const doc of docs) {
            const extractedChunks = await extractor.extract(doc);
            // Add metadata to each chunk
            extractedChunks.forEach(chunk => {
                chunk.metadata = {
                    ...chunk.metadata,
                    subject,
                    fileId,
                };
            });
            processedDocs.push(...extractedChunks);
        }
        console.log(`Processed into ${processedDocs.length} chunks`);

        // Add the documents to the vector store
        console.log('Fetching vector store...');
        const vectorStore = await getVectorStore(school);
        console.log('Adding documents to vector store...');
        await vectorStore.addDocuments(processedDocs);
        console.log('Documents successfully added to vector store');

        return fileId;
    } catch (error) {
        console.error('Error in uploadPDFService:', error);
        throw error;
    }
};

export const deletePDFService = async (school: string, fileId: string): Promise<void> => {
    console.log(`Deleting fileId: ${fileId} from vector store for school: ${school}`);

    try {
        const vectorStore = await getVectorStore(school);

        if (!vectorStore) {
            throw new Error(`Vector store not found for school: ${school}`);
        }

        const results = await vectorStore.collection.delete({
            where: {
                fileId: { "$eq": fileId } // Ensure this matches the correct metadata field
            }
        });

        console.log("Delete results:", results);
    } catch (error) {
        console.error("Error in deletePDFService:", error);
        throw error;
    }
};


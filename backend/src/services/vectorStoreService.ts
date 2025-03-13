import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { getVectorStore } from '../utils/vectorStore';
import { v4 as uuidv4 } from 'uuid';

export const uploadPDFService = async (filePath: string, school: string, subject: string): Promise<string> => {
    console.log(`Starting processAndStorePDF for file: ${filePath}, school: ${school}, subject: ${subject}`);

    // Generate a unique ID for the entire file
    const fileId = uuidv4();
    console.log(`Generated fileId: ${fileId}`);

    try {
        // Use LangChain's PDFLoader to load the PDF
        console.log('Loading PDF file...');
        const loader = new PDFLoader(filePath);
        const docs: Document[] = await loader.load();
        console.log(`Loaded ${docs.length} documents from PDF`);

        // Optionally, further split the document(s) using a text splitter
        console.log('Splitting documents...');
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 800,
            chunkOverlap: 400,
        });
        const splittedDocs: Document[] = await splitter.splitDocuments(docs);
        console.log(`Split into ${splittedDocs.length} chunks`);

        // Add school and course metadata to each chunk
        console.log('Adding metadata to documents...');
        const docsWithMetadata = splittedDocs.map((doc: Document) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                subject,
                fileId,
            },
        }));
        console.log(`Metadata:`, docsWithMetadata)
        console.log(`Metadata added to ${docsWithMetadata.length} documents`);

        // Get the vector store and add documents to it
        console.log('Fetching vector store...');
        const vectorStore = await getVectorStore(school);
        console.log('Adding documents to vector store...');
        await vectorStore.addDocuments(docsWithMetadata);
        console.log('Documents successfully added to vector store');

        return fileId;
    } catch (error) {
        console.error('Error in processAndStorePDF:', error);
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


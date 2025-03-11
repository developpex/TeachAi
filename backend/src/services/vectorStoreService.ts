import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { getVectorStore } from '../utils/vectorStore';
import { v4 as uuidv4 } from 'uuid';

export const processAndStorePDF = async (filePath: string, school: string, subject: string): Promise<void> => {
   // Generate a unique ID for the entire file
    const fileId = uuidv4();  
  
    // Use LangChain's PDFLoader to load the PDF
    const loader = new PDFLoader(filePath);
    const docs: Document[] = await loader.load();
    console.log('docs', docs);

    // Optionally, further split the document(s) using a text splitter
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 400,
    });
    const splittedDocs: Document[] = await splitter.splitDocuments(docs);
    console.log('splittedDocs', splittedDocs);

    // Add school and course metadata to each chunk
    const docsWithMetadata = splittedDocs.map((doc: Document) => ({
        ...doc,
        metadata: {
            ...doc.metadata,
            subject,
            fileId,
        },
    }));
    console.log('docsWithMetadata', docsWithMetadata);

    // Get the vector store and add documents to it
    const vectorStore = await getVectorStore(school);
    await vectorStore.addDocuments(docsWithMetadata);

    return fileId; // Return the unique fileId
};

export const deletePDF = async (school: string, fileId: string): Promise<void> => {
    const vectorStore = await getVectorStore(school);

    // Delete all documents where metadata.fileId matches
    await vectorStore.delete({
        filter: {
            fileId: fileId,
        },
    });

    console.log(`Deleted all documents with fileId: ${fileId}`);
};


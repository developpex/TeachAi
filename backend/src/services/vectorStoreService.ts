import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { getVectorStore } from '../utils/vectorStore';

export const processAndStorePDF = async (filePath: string, school: string, course: string): Promise<void> => {
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
            course,
        },
    }));
    console.log('docsWithMetadata', docsWithMetadata);

    // Get the vector store and add documents to it
    const vectorStore = await getVectorStore(school);
    await vectorStore.addDocuments(docsWithMetadata);
};


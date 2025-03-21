import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export class GenericTextExtractor {
        private splitByDelimiters(text: string): string[] {
        // This regex splits by two or more newlines or by common header markers (e.g., "Section:", "Chapter:")
        const delimiterRegex = /\n{2,}|(?=Section:|Chapter:|Learning Objectives:)/i;
        return text.split(delimiterRegex).filter(chunk => chunk.trim().length > 0);
    }

    async extract(doc: Document): Promise<Document[]> {
        const rawChunks = this.splitByDelimiters(doc.pageContent);
        const documents: Document[] = rawChunks.map(chunk => ({
            pageContent: chunk.trim(),
            metadata: doc.metadata,
        }));

        // If the chunks are too large, further split them using RecursiveCharacterTextSplitter.
        const refinedDocs: Document[] = [];
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 800,
            chunkOverlap: 200,
        });

        for (const d of documents) {
            if (d.pageContent.length > 800) {
                // Further split only if chunk is too large
                const furtherChunks = await splitter.splitDocuments([d]);
                refinedDocs.push(...furtherChunks);
            } else {
                refinedDocs.push(d);
            }
        }

        return refinedDocs;
    }
}

import { Embeddings } from 'langchain/embeddings/base';
import axios from 'axios';

export class OllamaEmbeddings extends Embeddings {
    private endpoint: string;
    private model: string;

    constructor(endpoint = 'http://localhost:11434/api/embeddings', model = 'nomic-embed-text') {
        super({});
        this.endpoint = endpoint;
        this.model = model;
    }

    /**
     * Embeds an array of documents.
     */
    async embedDocuments(texts: string[]): Promise<number[][]> {
        // We'll embed each text individually and collect results
        const embeddings: number[][] = [];
        for (const text of texts) {
            const embedding = await this.embedQuery(text);
            embeddings.push(embedding);
        }
        return embeddings;
    }

    /**
     * Embeds a single query string.
     */
    async embedQuery(text: string): Promise<number[]> {
        const payload = {
            model: this.model,
            prompt: text,
        };

        const response = await axios.post(this.endpoint, payload);
        // Check if the response contains an embedding in either property:
        if (response.data.embedding && response.data.embedding.length > 0) {
            return response.data.embedding;
        }
        if (response.data.embeddings && response.data.embeddings.length > 0) {
            return response.data.embeddings;
        }
        console.log("Ollama response:", response.data);
        throw new Error("No embeddings returned from Ollama.");
    }

}

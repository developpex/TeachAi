import { LLM, BaseLLMParams } from 'langchain/llms/base';
import axios from 'axios';

interface OllamaLLMOptions extends BaseLLMParams {
    endpoint?: string;
    model?: string;
    maxTokens?: number;
}

/**
 * A custom LLM class that calls a locally running Ollama model
 * (e.g., "deepseek-r1:1.5b").
 */
export class OllamaLLM extends LLM {
    endpoint: string;
    model: string;
    maxTokens: number;

    constructor(options: OllamaLLMOptions = {}) {
        super(options);
        this.endpoint = options.endpoint || 'http://localhost:11434/api/generate';
        this.model = options.model || 'deepseek-r1:1.5b';
        this.maxTokens = options.maxTokens || 512;
    }

    // The _call method is used internally by LangChain
    async _call(prompt: string, _options: this["ParsedCallOptions"]): Promise<string> {
        // Make a POST request to Ollama
        const payload = {
            model: this.model,
            prompt,
            max_tokens: this.maxTokens,
            // Possibly other Ollama options
        };

        const resp = await axios.post(this.endpoint, payload, { responseType: 'stream' });
        // We'll accumulate streamed chunks
        let finalText = '';
        const chunks: string[] = [];

        // Because it's streamed JSON lines, we read them as they come
        const stream = resp.data;
        for await (const chunk of stream) {
            chunks.push(chunk.toString());
        }
        const raw = chunks.join('');

        // Each line is a JSON object with { response: "...", done: false/true }
        // We'll parse them all, combine the "response" field
        const lines = raw.split('\n').filter(l => l.trim() !== '');
        for (const line of lines) {
            try {
                const json = JSON.parse(line);
                if (json.response) {
                    finalText += json.response;
                }
            } catch (err) {
                // ignore parse errors for partial lines
            }
        }
        return finalText;
    }

    _llmType(): string {
        return 'ollama';
    }
}

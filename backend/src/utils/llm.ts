import { Ollama } from '@langchain/ollama';

const llm = new Ollama({
    baseUrl: 'http://localhost:11434',
    model: 'deepseek-r1:1.5b',
    numPredict: 2048, // Increased to allow for longer responses
    temperature: 0,
});

export default llm;
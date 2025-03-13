import { Ollama } from '@langchain/ollama';

const llm = new Ollama({
    //baseUrl: 'http://161.97.144.1:11434',
    baseUrl: 'http://localhost:11434',
    model: 'deepseek-r1:1.5b',
    numPredict: 1000,
    temperature: 0,
});

export default llm;


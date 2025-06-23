import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ToolConfig } from '../../services/toolsService';

export const emailReplyTool: ToolConfig = {
    name: 'smart-email-reply',
    promptTemplate: ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `You are an expert email assistant. 
            Your task is to generate a clear, professional, and contextually appropriate email reply based on the provided details.
            THIS IS IMPORTANT: Do not include any self-introductions, disclaimers, or additional commentary.
            
            Only output the email reply.`
        ),
        HumanMessagePromptTemplate.fromTemplate('{history}\n{input}'),
    ]),
    formatInitialInput: (data: {
        receiver: string;
        tone: string;
        email: string;
    }) => {
        return `
            Generate a well-structured email reply with the following details:
            
            Receiver: ${data.receiver}
            Tone: ${data.tone}
            Email to respond to: 
            "${data.email}"
            
            Email Reply Format:
            1. Greeting
            2. Acknowledgment of the received email
            3. Main Response (addressing key points)
            4. Closing statement
            5. Signature (if applicable)
            
            Always generate the complete email reply in this order.
        `;
    },
    formatFollowupInput: (followup: string) => {
        return `
            Please update the previous email reply to incorporate the following change:
                "${followup}"
            Return the entire updated email reply.
        `;
    },
};

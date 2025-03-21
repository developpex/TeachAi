import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ToolConfig } from '../../services/toolsService';

export const newsletterTool: ToolConfig = {
    name: 'ai-newsletter-generator',
    promptTemplate: ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `You are an expert content writer and newsletter editor.
            Your task is to generate a well-structured and engaging newsletter based on the provided details.
            Do not include any self-introductions, disclaimers, or additional commentary.
            Only output the newsletter.`
        ),
        HumanMessagePromptTemplate.fromTemplate('{history}\n{input}'),
    ]),
    formatInitialInput: (data: {
        audience: string;
        keyTopics: string;
        additionalInformation: string;
        tone: string;
    }) => {
        return `
            Generate a well-structured and engaging newsletter with the following details:
            
            Audience: ${data.audience}
            Key Topics: ${data.keyTopics}
            Tone: ${data.tone}
            Additional Information: ${data.additionalInformation}
            
            Newsletter Format:
            1. Header with Title
            2. Introduction
            3. Main Content Sections (covering key topics)
            4. Call-to-Action (if applicable)
            5. Closing Remarks
            
            Always generate the complete newsletter in this order.
        `;
    },
    formatFollowupInput: (followup: string) => {
        return `
            Please update the complete newsletter from the previous conversation context to incorporate the following change:
                "${followup}"
            Return the entire updated newsletter.
        `;
    },
};

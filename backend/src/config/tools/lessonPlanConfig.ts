import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ToolConfig } from '../../services/toolsService';

export const lessonPlanTool: ToolConfig = {
    name: 'ai-lesson-planner',
    promptTemplate: ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `You are an expert educator and curriculum designer.
            Your task is to generate a highly detailed and structured lesson plan based on the provided details.
            Do not include any self-introductions, disclaimers, or additional commentary.
            Only output the lesson plan.`
        ),
        HumanMessagePromptTemplate.fromTemplate('{history}\n{input}'),
    ]),
    formatInitialInput: (data: {
        subject: string;
        gradeLevel: string;
        topic: string;
        learningObjectives: string;
    }) => {
        return `
            Generate a highly detailed and structured lesson plan with the following requirements:
            
            Subject: ${data.subject}
            Grade Level: ${data.gradeLevel}
            Topic: ${data.topic}
            Learning Objectives: ${data.learningObjectives}
            
            Lesson Plan Format:
            1. Lesson Title
            2. Lesson Duration
            3. Lesson Overview
            4. Materials Needed
            5. Step-by-Step Lesson Procedure (Introduction → Main Activity → Assessment → Closing)
            6. Differentiation Strategies
            7. Homework/Extensions
            8. Teacher Notes & Tips
            
            Please generate the complete lesson plan in this order.
        `;
    },
    formatFollowupInput: (followup: string) => {
        return `
            Please update the complete lesson plan from the previous conversation context to incorporate the following change:
                "${followup}"
            Return the entire updated lesson plan.
        `;
    },
};

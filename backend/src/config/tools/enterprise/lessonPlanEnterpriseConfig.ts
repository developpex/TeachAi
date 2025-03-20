import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ToolConfig } from '../../../services/toolsService';

export const lessonPlanEnterpriseTool: ToolConfig = {
    name: 'enterprise-test',
    promptTemplate: ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(
            `You are an expert educator and curriculum designer.
            Your task is to generate a highly detailed and structured lesson plan based on the provided details.
            Do not include any self-introductions, disclaimers, or additional commentary.
            Only output the lesson plan.`
        ),
        HumanMessagePromptTemplate.fromTemplate('{history}\n{input}'),
    ]),
    formatInitialInput: (data: { subject: string; gradeLevel: string; topic: string; learningObjectives: string; context?: string }) => {
        console.log(data.context);

        return `
          You are an expert educator and curriculum designer. Your task is to generate a highly detailed and structured lesson plan that specifically and deeply addresses the provided Topic. In particular, you must carefully analyze the Additional Context to extract and incorporate relevant learning outcomes that align with the subject.

        Please strictly follow the format below:
        
        Subject: ${data.subject}
        Grade Level: ${data.gradeLevel}
        Topic: ${data.topic}
        
        Additional Context (if provided): ${data.context || 'None'}
        
        Using the additional context, identify key learning outcomes and integrate them throughout the lesson plan.
        
        Your lesson plan must include the following sections in order:
        
        1. Lesson Title – Create an engaging title that reflects the topic and the learning outcomes derived from the additional context.
        2. Lesson Duration – Specify the estimated time required for the lesson.
        3. Lesson Overview – Provide a concise summary that outlines how the topic and the extracted learning outcomes will be addressed.
        4. Materials Needed – List all required materials and resources.
        5. Step-by-Step Lesson Procedure – Describe each phase of the lesson (Introduction, Main Activity, Assessment, Closing) with specific actions. Ensure that the topic, learning outcomes, and additional context are thoroughly integrated into each phase.
        6. Differentiation Strategies – Outline approaches to cater to diverse learners, incorporating the learning outcomes.
        7. Homework/Extensions – Suggest follow-up activities or homework that reinforce the topic and the learning outcomes.
        8. Teacher Notes & Tips – Offer additional recommendations for effective lesson delivery, emphasizing how to use the additional context to support the learning outcomes.
        
        Make sure to look through the Additional Context and extract the learning outcomes based on the subject provided. Your generated lesson plan should be cohesive, relevant, and focused on these outcomes without including any extraneous information or personal commentary.
        
        Generate the complete lesson plan in the order specified above.
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

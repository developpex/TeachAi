// backend/LessonPlanHandler.ts
import { generateLessonPlanConversation } from '../../services/toolsService';

interface LessonPlanData {
    subject: string;
    gradeLevel: string;
    topic: string;
    learningObjectives: string;
    toolId: string;
    toolName: string;
    prompt?: string; // optional follow-up prompt
    userId?: string;
    schoolId?: string;
}

const processLessonPlan = async (
    data: LessonPlanData,
    sendChunk: (chunk: string) => void
) => {
    console.log("🎯 Received lesson plan request:", data);

    try {
        await generateLessonPlanConversation(
            {
                subject: data.subject,
                gradeLevel: data.gradeLevel,
                topic: data.topic,
                learningObjectives: data.learningObjectives,
            },
            data.prompt || null,
            sendChunk
        );
    } catch (error) {
        console.error("❌ Error streaming lesson plan:", error);
        throw new Error("Failed to stream lesson plan.");
    }
};

export { processLessonPlan };

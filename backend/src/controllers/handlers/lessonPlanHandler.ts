import { runToolInitial, runToolFollowup } from '../../services/toolsService';
import { lessonPlanTool } from '../../config/tools/lessonPlanConfig';

interface LessonPlanData {
    subject: string;
    gradeLevel: string;
    topic: string;
    learningObjectives: string;
    prompt?: string; // Optional follow-up prompt
    userId?: string;
}

export const processLessonPlan = async (
    data: LessonPlanData,
    sendChunk: (chunk: string) => void
) => {
    console.log("🎯 Received lesson plan request:", data);
    const userId = data.userId || 'anonymous';

    try {
        if (data.prompt) {
            await runToolFollowup(userId, lessonPlanTool, data.prompt, sendChunk);
        } else {
            await runToolInitial(userId, lessonPlanTool, data, sendChunk);
        }
    } catch (error) {
        console.error("❌ Error streaming lesson plan:", error);
        throw new Error("Failed to stream lesson plan.");
    }
};

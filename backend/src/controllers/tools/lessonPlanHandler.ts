import { generateLessonPlan } from '../../services/toolsService';

interface LessonPlanData {
  subject: string;
  gradeLevel: string;
  topic: string;
  learningObjectives: string;
  toolId: string;
  toolName: string;
  userId?: string;
  schoolId?: string;
}

const processLessonPlan = async (data: LessonPlanData, sendChunk: (chunk: string) => void) => {
    console.log("🎯 Received lesson plan request:", data);

    try {
        // Pass data and streaming callback to processQueryStream
        await generateLessonPlan({
            subject: data.subject,
            gradeLevel: data.gradeLevel,
            topic: data.topic,
            learningObjectives: data.learningObjectives
        }, sendChunk);
    } catch (error) {
        console.error("❌ Error streaming lesson plan:", error);
        throw new Error("Failed to stream lesson plan.");
    }
};

export {processLessonPlan};
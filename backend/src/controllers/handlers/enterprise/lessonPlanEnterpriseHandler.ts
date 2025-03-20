import { runToolInitial, runToolFollowup } from '../../../services/toolsService';
import { lessonPlanEnterpriseTool } from '../../../config/tools/enterprise/lessonPlanEnterpriseConfig';
import { getDocumentsFromVectorStore } from '../../../utils/vectorStore';

interface LessonPlanEnterpriseData {
    metadata: {
        schoolId: string;
    }
    subject: string;
    topic: string;
    prompt?: string; // Optional follow-up prompt
    userId?: string;
}

export const processLessonPlanEnterprise = async (
    data: LessonPlanEnterpriseData,
    sendChunk: (chunk: string) => void
) => {
    console.log("🎯 Received lesson plan enterprise request:", data);
    const userId = data.userId || 'anonymous';
    try {
        const question = `Extract the ${data.topic} section from the learning objectives`
        const context = await getDocumentsFromVectorStore(data.metadata.schoolId, data.subject, question || '');

        // Merge context into your input data for formatting, e.g., as additional property
        const inputData = {
            ...data,
            context,
        };

        // Use the context in your formatted prompt. You can update your tool config
        // to handle context if necessary, or incorporate it into the data before calling formatInitialInput.
        if (data.prompt) {
            await runToolFollowup(userId, lessonPlanEnterpriseTool, data.prompt, sendChunk);
        } else {
            await runToolInitial(userId, lessonPlanEnterpriseTool, inputData, sendChunk);
        }
    } catch (error) {
        console.error("❌ Error processing enterprise lesson plan with context:", error);
        throw new Error("Failed to process enterprise lesson plan.");
    }
};


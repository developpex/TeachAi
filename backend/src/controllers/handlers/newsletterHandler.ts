import { runToolInitial, runToolFollowup } from '../../services/toolsService';
import { newsletterTool } from '../../config/tools/newsletterConfig';

interface newsletterData {
    audience: string;
    keyTopics: string;
    additionalInformation: string;
    tone: string;
    prompt?: string; // Optional follow-up prompt
    userId?: string;
}

export const processNewsletter = async (
    data: newsletterData,
    sendChunk: (chunk: string) => void
) => {
    console.log("🎯 Received newsletter request:", data);
    const userId = data.userId || 'anonymous';

    try {
        if (data.prompt) {
            await runToolFollowup(userId, newsletterTool, data.prompt, sendChunk);
        } else {
            await runToolInitial(userId, newsletterTool, data, sendChunk);
        }
    } catch (error) {
        console.error("❌ Error streaming newsletter:", error);
        throw new Error("Failed to stream newsletter.");
    }
};

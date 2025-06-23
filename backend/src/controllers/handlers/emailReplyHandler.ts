import { runToolInitial, runToolFollowup } from '../../services/toolsService';
import { emailReplyTool } from '../../config/tools/emailReplyConfig';

interface emailReplyData {
    receiver: string;
    tone: string;
    email: string;
    prompt?: string; // Optional follow-up prompt
    userId?: string;
}

export const processEmailReply = async (
    data: emailReplyData,
    sendChunk: (chunk: string) => void
) => {
    console.log("🎯 Received email reply request:", data);
    const userId = data.userId || 'anonymous';

    try {
        if (data.prompt) {
            await runToolFollowup(userId, emailReplyTool, data.prompt, sendChunk);
        } else {
            await runToolInitial(userId, emailReplyTool, data, sendChunk);
        }
    } catch (error) {
        console.error("❌ Error streaming email reply:", error);
        throw new Error("Failed to stream email reply.");
    }
};

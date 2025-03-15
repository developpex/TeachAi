// backend/toolsRoute.ts
import { Router } from 'express';
import {clearConversation, generateLessonPlan, handleFollowUp} from '../services/toolsService';

const router = Router();

router.post('/:toolId/generate', async (req, res) => {
    console.log(req.body);
    const { toolId } = req.params;
    const formData = req.body;
    const userId = req.body.metadata?.userId || 'anonymous'; // Get user ID from request
    console.log(userId);

    console.log("Processing request...");

    try {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        if (formData.isFollowUp) {
            // Handle follow-up question
            console.log(userId);
            await handleFollowUp(userId, formData.prompt, (chunk) => {
                res.write(chunk);
            });
        } else {
            // Handle initial lesson plan generation
            await generateLessonPlan({
                ...formData,
                userId
            }, (chunk) => {
                res.write(chunk);
            });
        }

        res.end();
    } catch (error) {
        console.error(`❌ Error processing ${toolId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:toolId/clear', async (req, res) => {
    console.log("post req: ", req.body);
    const userId = req.body.userId || 'anonymous';

    console.log("post userid: ", userId);

    try {
        clearConversation(userId);
        res.status(200).json({ message: "Conversation cleared" });
    } catch (error) {
        console.error(`❌ Error deleting conversation for userid ${userId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

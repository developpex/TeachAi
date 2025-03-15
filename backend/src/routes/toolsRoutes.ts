import { Router } from 'express';
import { clearConversation } from '../services/toolsService';
import { processLessonPlan } from '../controllers/tools/lessonPlanHandler';

const router = Router();

router.post('/:toolId/generate', async (req, res) => {
    console.log(req.body);
    const { toolId } = req.params;
    const formData = req.body;
    const userId = req.body.metadata?.userId || 'anonymous';

    try {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        await processLessonPlan(
            {
                subject: formData.subject,
                gradeLevel: formData.gradeLevel,
                topic: formData.topic,
                learningObjectives: formData.learningObjectives,
                prompt: formData.isFollowUp ? formData.prompt : undefined,
                userId,
            },
            (chunk) => {
                res.write(chunk);
            }
        );

        res.end();
    } catch (error) {
        console.error(`❌ Error processing ${toolId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:toolId/clear', async (req, res) => {
    console.log("post req: ", req.body);
    const userId = req.body.userId || 'anonymous';

    try {
        clearConversation(userId);
        res.status(200).json({ message: "Conversation cleared" });
    } catch (error) {
        console.error(`❌ Error deleting conversation for userid ${userId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

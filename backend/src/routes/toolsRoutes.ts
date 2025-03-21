import { Router } from 'express';
import { clearConversation } from '../services/toolsService';
import { toolHandlers } from '../controllers/toolsRegistry';

const router = Router();

router.post('/:toolId/generate', async (req, res) => {
    const { toolId } = req.params;
    const formData = req.body;
    // Attach userId if not already provided
    formData.userId = formData.metadata?.userId || 'anonymous';

    const handler = toolHandlers[toolId];
    if (!handler) {
        return res.status(400).json({ error: `Tool ${toolId} not supported` });
    }

    try {
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        await handler(formData, (chunk) => {
            res.write(chunk);
        });

        res.end();
    } catch (error) {
        console.error(`Error processing ${toolId}:`, error);
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
        console.error(`Error deleting conversation for userid ${userId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

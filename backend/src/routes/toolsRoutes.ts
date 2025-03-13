import { Router } from 'express';
import { processLessonPlan } from '../controllers/toolsController';

const router = Router();

// Streaming endpoint
router.post('/:toolId/generate', async (req, res) => {
    const { toolId } = req.params;
    const formData = req.body;

  console.log("here")

    try {
        res.setHeader('Content-Type', 'text/plain'); // Set content type to plain text
        res.setHeader('Transfer-Encoding', 'chunked'); // Enable streaming

        await processLessonPlan(formData, (chunk) => {
            res.write(chunk); // Send each chunk to the client
        });

        res.end(); // End the stream when done
    } catch (error) {
        console.error(`❌ Error processing ${toolId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

import { Request, Response, NextFunction } from 'express';
import { processQuery } from '../services/toolsService';

export const queryHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { school, subject, question } = req.body;
        if (!school || !subject || !question) {
            return res.status(400).json({ error: 'Missing school, course, or question.' });
        }

        // Delegate processing of the query to the service layer.
        const answer = await processQuery(school, subject, question);
        res.json({ answer });
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

import { Request, Response, NextFunction } from 'express';
import { processAndStorePDF } from '../services/vectorStoreService';

export const uploadPDF = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { school, course } = req.body;
        if (!req.file || !school || !course) {
            return res.status(400).json({ error: 'Missing file, school, or course' });
        }

        // Pass the file path and metadata to the service layer.
        await processAndStorePDF(req.file.path, school, course);

        res.json({ message: 'PDF uploaded and indexed successfully.' });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

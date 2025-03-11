import { Request, Response, NextFunction } from 'express';
import { processAndStorePDF, deletePDFService } from '../services/vectorStoreService';

export const uploadPDF = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { school, subject } = req.body;
        if (!req.file || !school || !subject) {
            return res.status(400).json({ error: 'Missing file, school, or subject' });
        }

        // Pass the file path and metadata to the service layer and get the fileId
        const fileId = await processAndStorePDF(req.file.path, school, subject);

        res.json({ message: 'PDF uploaded and indexed successfully.', fileId });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const deletePDF = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Incoming DELETE request:');
    console.log('Headers:', req.headers);
    console.log('Raw Body:', req.body);

    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid or missing request body' });
    }

    const { fileId, school } = req.body;

    if (!fileId || !school) {
        return res.status(400).json({ error: 'Missing fileId or school' });
    }

    try {
        await deletePDFService(school, fileId);
        res.json({ message: `PDF deleted for school '${school}' with fileID ${fileId} successfully.` });
    } catch (error) {
        console.error('Deletion error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



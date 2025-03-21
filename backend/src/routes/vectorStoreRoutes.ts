import { Router } from 'express';
import {uploadPDF, deletePDF} from "../controllers/vectorStoreController";
import upload from "../utils/pdfUploader";

const router = Router();

router.post('/upload', upload.single('file'), uploadPDF);
router.post('/delete', deletePDF);

export default router;

import { Router } from 'express';
import upload from "../utils/pdfUploader";
import {uploadPDF} from "../controllers/vectorStoreController";


const router = Router();

// Upload route: uses Multer middleware to store the file,
// then passes control to the vector store controller.
router.post('/upload', upload.single('file'), uploadPDF);

export default router;

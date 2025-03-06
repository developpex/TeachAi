import multer from 'multer';

// Store uploaded PDFs in 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

export default upload;

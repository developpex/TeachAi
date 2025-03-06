import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-production-domain.com']
        : ['http://localhost:5173','http://localhost:5174', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

export default corsOptions;
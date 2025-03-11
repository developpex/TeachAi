import express from 'express';
import {NextFunction, Response, Request} from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from "helmet";
import corsOptions from './config/corsConfig';
import { setupRoutes } from './config/setupRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Parses URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors(corsOptions));

// Setup routes
setupRoutes(app);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

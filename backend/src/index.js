import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stripeRoutes from './routes/stripeRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-production-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Pre-flight requests
app.options('*', cors());

// Regular routes
app.use('/api', express.json(), stripeRoutes);
app.use('/api/admin', express.json(), adminRoutes);

// Webhook route (needs raw body)
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
import { Express } from 'express';
import * as express from 'express';
import stripeRoutes from '../routes/stripeRoutes';
import webhookRoutes from '../routes/webhookRoutes';
import vectorStoreRoute from "../routes/vectorStoreRoutes";
import toolsRoute from "../routes/toolsRoutes";
import userRoutes from "../routes/userRoutes";

export function setupRoutes(app: Express) {
    app.use('/stripe', stripeRoutes);
    app.use('/user', userRoutes);
    app.use('/vectorStore', vectorStoreRoute);
    app.use('/tools', toolsRoute);
    app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
}
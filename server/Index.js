import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './Routes/auth.route.js';
import campaignRoutes from './Routes/campaign.route.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/')
    .then(() => {
        console.log('Mongo is Connected');
    })
    .catch((err) => {
        console.error(err);
    });

// Export the Express app as a serverless function
export default app;

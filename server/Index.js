import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './Routes/auth.route.js';
import campaignRoutes from './Routes/campaign.route.js';


dotenv.config();

const app = express();

// CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ 
    limit: '50mb', 
    extended: true, 
    parameterLimit: 50000 
}));

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

app.get('/', (req, res) => {
    res.send('CrowdBlock Backend is Running!');
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Mongo is Connected');
})
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
});

export default app;

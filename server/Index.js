import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './Routes/auth.route.js';
import campaignRoutes from './Routes/campaign.route.js';
import path from 'path';


dotenv.config();

const app = express();

// CORS Configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

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

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server running on port 3000`)
})

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

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;

// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://crowd-block-d-app-frontend.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    next();
});


app.use(
    cors({
        origin: "https://crowd-block-d-app-frontend.vercel.app", // Allow frontend running on port 5173 (Vite)
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        credentials: true, // Allow cookies if needed
    })
);

// Import routes
import authRoutes from './Routes/auth.route.js';
import campaignRoutes from './Routes/campaign.route.js';



app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


export default app;

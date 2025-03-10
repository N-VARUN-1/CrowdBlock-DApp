// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Import routes
import authRoutes from './Routes/auth.route.js';
import campaignRoutes from './Routes/campaign.route.js';

// IMPORTANT: CORS middleware must be one of the first middleware
app.use(cors({
    origin: "https://crowd-block-d-app-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Other middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));



app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);



// OPTIONS preflight response for all routes
app.options('*', (req, res) => {
    res.status(204).end();
});

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

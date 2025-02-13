// import express from 'express'
// import mongoose from 'mongoose';
// import cookieParser from 'cookie-parser'
// import cors from 'cors'
// import path from 'path';

// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();

// const _dirname = path.resolve();

// const CorsOptions = {
//     origin: 'https://crowd-block-d-app-6t9u.vercel.app',
//     credentials: true
// }

// app.use(cors(CorsOptions));

// import authRoutes from '../server/Routes/auth.route.js'
// import campaignRoutes from '../server/Routes/campaign.route.js'

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port 3000`)
// })

// mongoose.connect(process.env.MONGO_URI).then(() => {
//     console.log("Mongo is Connected");
// })
//     .catch((err) => {
//         console.log(err);
//     })

// app.use(express.json());      // Make sure your server is properly parsing JSON bodies. If you're using Express, ensure you have the JSON middleware:
// app.use(cookieParser());
// app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// app.use('/api/auth', authRoutes);
// app.use('/api/campaign', campaignRoutes);

// app.use(express.static(path.join(_dirname, '/client/dist')));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
// })







import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const _dirname = path.resolve();

// Production environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Configure CORS for production
const corsOptions = {
    origin: CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Import routes
import authRoutes from '../server/Routes/auth.route.js';
import campaignRoutes from '../server/Routes/campaign.route.js';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ 
    limit: '50mb', 
    extended: true, 
    parameterLimit: 50000 
}));



// API routes
app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

// Serve static files
app.use(express.static(path.join(_dirname, '/client/dist')));

// Handle React routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

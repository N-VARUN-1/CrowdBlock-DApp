import express from 'express'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

const _dirname = path.resolve();

const CorsOptions = {
    origin: 'https://crowd-block-d-app-6t9u.vercel.app',
    credentials: true
}

app.use(cors(CorsOptions));

import authRoutes from '../server/Routes/auth.route.js'
import campaignRoutes from '../server/Routes/campaign.route.js'

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port 3000`)
})

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Mongo is Connected");
})
    .catch((err) => {
        console.log(err);
    })

app.use(express.json());      // Make sure your server is properly parsing JSON bodies. If you're using Express, ensure you have the JSON middleware:
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

app.use(express.static(path.join(_dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
})

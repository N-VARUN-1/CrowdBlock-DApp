import express from 'express'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'

import dotenv from 'dotenv';
dotenv.config();

const app = express();

import authRoutes from '../server/Routes/auth.route.js'
import campaignRoutes from '../server/Routes/campaign.route.js'

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log(`Server running on port 3000`)
})

mongoose.connect('mongodb://localhost:27017/').then(() => {
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

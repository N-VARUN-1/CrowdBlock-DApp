import mongoose, { Schema } from 'mongoose';
import User from './user.model.js';

const creatCampaignSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    targetAmount: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    userId: {
        type: String,
        ref: 'User', // Reference to the User model
        required: true
    },
    campaignId: {
        type: Number
    },
    photo: { type: String }
}, { timestamps: true })

const createCampaign = mongoose.model('createCampaign', creatCampaignSchema);

export default createCampaign;
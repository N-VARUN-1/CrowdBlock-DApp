import createCampaign from "../Models/createCampaign.model.js";
import mongoose from 'mongoose'; // Add this import

export const createCampaignFn = async (req, res) => {
    const { title, description, targetAmount, fromDate, toDate, userId, campaignId } = req.body;
    const photo = req.file ? req.file.buffer.toString('base64') : null;

    try {
        if (!title || !description || !targetAmount || !fromDate || !toDate || !campaignId) {
            return res.status(409).json({ message: "Please fill all the fields!" });
        }

        const newCampaign = new createCampaign({
            title,
            description,
            targetAmount,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            userId,
            photo,
            campaignId
        });

        await newCampaign.save();

        res.status(201).json({ message: "Campaign Created", campaign: newCampaign });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCampaignDetails = async (req, res) => {
    const { userId } = req.params;
    // console.log(userId);
    try {
        const campaigns = await createCampaign.find({ userId });
        if ((!campaigns)) {
            return res.status(404).json({ message: "No campaigns created." })
        }

        res.status(200).json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getAllCampaigns = async (req, res) => {
    try {
        const allCampaigns = await createCampaign.find({});
        if (allCampaigns.length === 0) {
            return res.status(404).json({ message: "No campaigns found." });
        }

        res.status(200).json(allCampaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
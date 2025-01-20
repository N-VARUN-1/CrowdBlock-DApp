import express from 'express';
const router = express.Router();
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { createCampaignFn, getAllCampaigns, getCampaignDetails } from '../Controller/createCamapaign.controller.js'


router.post('/create-campaign', upload.single('photo'), createCampaignFn);
router.get('/get-campaign-details/:userId', getCampaignDetails);
router.get('/get-all-campaigns', getAllCampaigns);

export default router;
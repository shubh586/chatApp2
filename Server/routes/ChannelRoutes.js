import express from 'express';
const router=express.Router();
import {createChannel,getUserChannels} from '../controllers/Channelcontroller.js';  
import {varifyToken} from '../middleware/Authenticatemiddleware.js';
router.post('/create-channel',varifyToken,createChannel);
router.get('/get-user-channels',varifyToken,getUserChannels);
export default router;



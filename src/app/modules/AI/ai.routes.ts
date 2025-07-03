import express from 'express';
import { sendToAI } from './ai.controler';

const router = express.Router();

router.post('/', sendToAI);

export default router;

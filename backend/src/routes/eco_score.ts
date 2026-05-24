import { Router } from 'express';
import {ecoscoreController } from '../controllers/eco_score';

const router = Router();

router.post('/get_eco_score', ecoscoreController);

export default router;

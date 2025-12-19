import express from 'express';
import { getGoalsProgress, getStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getStats);
router.get('/goals', getGoalsProgress);

export default router;
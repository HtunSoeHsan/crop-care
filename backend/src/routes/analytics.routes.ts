import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { getScanAnalytics } from '../controllers/analytics.controller';

const router = express.Router();

router.get('/scans', authenticateToken, getScanAnalytics);

export default router;
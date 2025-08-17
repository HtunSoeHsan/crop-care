import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { getScanHistory, deleteScanHistory } from '../controllers/scan-history.controller';
import { saveScanResult } from '../controllers/scan-save.controller';

const router = express.Router();

// Get user's scan history
router.get('/', authenticateToken, getScanHistory);

// Save scan result
router.post('/save', authenticateToken, saveScanResult);

// Delete specific scan from history
router.delete('/:scanId', authenticateToken, deleteScanHistory);

export default router;
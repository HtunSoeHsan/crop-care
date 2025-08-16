import express from 'express';
import {
  getAllPlantGuides,
  getPlantGuide,
  createPlantGuide,
  updatePlantGuide,
  deletePlantGuide,
  ratePlantGuide,
  searchPlantGuides,
  getFeaturedGuides,
  getPopularGuides
} from '../controllers/plant-care.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/guides', getAllPlantGuides);
router.get('/guides/featured', getFeaturedGuides);
router.get('/guides/popular', getPopularGuides);
router.get('/guides/search', searchPlantGuides);
router.get('/guides/:id', getPlantGuide);

// Protected routes
router.post('/guides', authenticateToken, createPlantGuide);
router.put('/guides/:id', authenticateToken, updatePlantGuide);
router.delete('/guides/:id', authenticateToken, deletePlantGuide);
router.post('/guides/:id/rate', authenticateToken, ratePlantGuide);

export default router;

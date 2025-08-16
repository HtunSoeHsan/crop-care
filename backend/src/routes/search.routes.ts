import { Router } from 'express';
import {
  searchAll,
  searchDiseases,
  searchPlantGuides,
  searchHealthyFoods,
  getSearchSuggestions
} from '../controllers/search.controller';

const router = Router();

// Comprehensive search across all content types
router.get('/all', searchAll);

// Search specific content types
router.get('/diseases', searchDiseases);
router.get('/plant-guides', searchPlantGuides);
router.get('/healthy-foods', searchHealthyFoods);

// Get search suggestions for autocomplete
router.get('/suggestions', getSearchSuggestions);

export default router; 
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getUserPlants,
  getPlantById,
  addPlantToCollection,
  updatePlant,
  deletePlant,
  addCareActivity,
  getPlantCareHistory,
  updatePlantReminders,
  getUpcomingReminders
} from '../controllers/plant-collection.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/plant-collection');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for plant images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `plant-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

// All routes are protected (require authentication)
router.use(authenticateToken);

// Plant collection routes
router.get('/plants', getUserPlants);
router.get('/plants/:id', getPlantById);
router.post('/plants', upload.array('images', 5), addPlantToCollection);
router.put('/plants/:id', upload.array('images', 5), updatePlant);
router.delete('/plants/:id', deletePlant);

// Care activity routes
router.post('/plants/:id/care', upload.array('images', 3), addCareActivity);
router.get('/plants/:id/care-history', getPlantCareHistory);

// Reminders routes
router.get('/reminders/upcoming', getUpcomingReminders);
router.put('/plants/:id/reminders', updatePlantReminders);

export default router;

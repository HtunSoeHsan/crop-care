import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} from '../controllers/resourceController';

const router = express.Router();

// Get all resources
router.get('/', getResources);

// Get resource by ID
router.get('/:id', getResourceById);

// Create new resource
router.post('/', createResource);

// Update resource
router.put('/:id', updateResource);

// Delete resource
router.delete('/:id', deleteResource);

export default router;
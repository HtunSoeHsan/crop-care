import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth';
import { createResource, deleteResource, getResources, updateResource } from '../controllers/resourceController';
import { createHealthyFood, deleteHealthyFood, getHealthyFoods, updateHealthyFood } from '../controllers/healthyFoodController';
import { deleteUser, getUsers, updateUser } from '../controllers/userController';

const router = Router();

// Resources
router.get('/resources', requireAdmin, getResources);
router.post('/resources', requireAdmin, createResource);
router.put('/resources/:id', requireAdmin, updateResource);
router.delete('/resources/:id', requireAdmin, deleteResource);

// Healthy Foods
router.get('/healthy-foods', requireAdmin, getHealthyFoods);
router.post('/healthy-foods', requireAdmin, createHealthyFood);
router.put('/healthy-foods/:id', requireAdmin, updateHealthyFood);
router.delete('/healthy-foods/:id', requireAdmin, deleteHealthyFood);

// Users
router.get('/users', requireAdmin, getUsers);
router.put('/users/:id', requireAdmin, updateUser);
router.delete('/users/:id', requireAdmin, deleteUser);

export default router;

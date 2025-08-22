import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { createResource, deleteResource, getResources, updateResource } from '../controllers/resourceController';
import { createHealthyFood, deleteHealthyFood, getHealthyFoods, updateHealthyFood } from '../controllers/healthyFoodController';
import { deleteUser, getUsers, toggleUserStatus, updateUser, updateUserRole } from '../controllers/userController';
import { createDisease, deleteDisease, getDiseases, updateDisease } from '../controllers/diseaseController';

const router = Router();

// Resources
router.get('/resources', authenticateToken, requireAdmin, getResources);
router.post('/resources', authenticateToken, requireAdmin, createResource);
router.put('/resources/:id', authenticateToken, requireAdmin, updateResource);
router.delete('/resources/:id', authenticateToken, requireAdmin, deleteResource);

// Healthy Foods
router.get('/healthy-foods', authenticateToken, requireAdmin, getHealthyFoods);
router.post('/healthy-foods', authenticateToken, requireAdmin, createHealthyFood);
router.put('/healthy-foods/:id', authenticateToken, requireAdmin, updateHealthyFood);
router.delete('/healthy-foods/:id', authenticateToken, requireAdmin, deleteHealthyFood);

// Users
router.get('/users', authenticateToken, requireAdmin, getUsers);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.patch('/users/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);
router.patch('/users/:id/role', authenticateToken, requireAdmin, updateUserRole);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

// Diseases
router.get('/diseases', authenticateToken, requireAdmin, getDiseases);
router.post('/diseases', authenticateToken, requireAdmin, createDisease);
router.put('/diseases/:id', authenticateToken, requireAdmin, updateDisease);
router.delete('/diseases/:id', authenticateToken, requireAdmin, deleteDisease);

export default router;

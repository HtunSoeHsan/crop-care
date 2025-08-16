import express from 'express';
import { register, login, getProfile, updateProfile, googleAuth } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import passport from 'passport';
import '../config/passport'; 
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);


// Google Auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuth);
// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router; 
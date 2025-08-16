import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  createReply,
  voteReply
} from '../controllers/forum.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);

// Protected routes
router.post('/posts', authenticateToken, createPost);
router.post('/posts/:id/replies', authenticateToken, createReply);
router.post('/replies/:id/vote', authenticateToken, voteReply);

export default router; 
import express from 'express';
import { 
  generateChatResponse, 
  getConversationHistory, 
  clearConversationHistory, 
  getChatbotHealth
} from '../controllers/chatbot.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes (no authentication required)
router.post('/chat', generateChatResponse);
router.get('/health', getChatbotHealth);

// Protected routes (authentication required)
router.get('/history', authenticateToken, getConversationHistory);
router.delete('/history', authenticateToken, clearConversationHistory);

export default router; 
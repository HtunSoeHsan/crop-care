import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import enhancedDetectionRoutes from './routes/detection.routes';
import forumRoutes from './routes/forum.routes';
import weatherRoutes from './routes/weather.routes';
import debugRoutes from './routes/debug.routes';
import plantCareRoutes from './routes/plant-care.routes';
import plantCollectionRoutes from './routes/plant-collection.routes';
import chatbotRoutes from './routes/chatbot.routes';
import searchRoutes from './routes/search.routes';
import adminRoutes from './routes/admin'; // Import admin routes
import scanHistoryRoutes from './routes/scan-history.routes';
import analyticsRoutes from './routes/analytics.routes';
import cookieParser from 'cookie-parser'
// Import passport (you must have this file)
import passport from 'passport';
import './config/passport'; // Initializes Passport strategies

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize database connection
connectDatabase();

// Middleware
app.use(cors({
  origin: ['http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Session middleware (required for Passport OAuth flow)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));
app.use(passport.initialize() as any);
app.use(passport.session() as any); // Optional: only needed if you keep sessions

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/detections', enhancedDetectionRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/plant-care', plantCareRoutes);
app.use('/api/plant-collection', plantCollectionRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes); // Register admin routes
app.use('/api/scan-history', scanHistoryRoutes);
app.use('/api/analytics', analyticsRoutes);
// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 API: http://localhost:${PORT}/api/auth/login`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('❌ HTTP server closed');
  });
  // MongoDB connection will be handled by the database config
  process.exit(0);
});

export { app };

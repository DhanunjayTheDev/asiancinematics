import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

import config from './config';
import { connectDB } from './config/database';
import { getRedis } from './config/redis';
import { swaggerOptions } from './config/swagger';
import { initSocket } from './socket';
import { initWorkers } from './jobs/notificationJob';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Routes
import authRoutes from './routes/auth';
import addressRoutes from './routes/address';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import serviceRoutes from './routes/service';
import siteVisitRoutes from './routes/siteVisit';
import inquiryRoutes from './routes/inquiry';
import notificationRoutes from './routes/notification';
import adminRoutes from './routes/admin';

const app = express();
const server = http.createServer(app);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', config.upload.path);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(
  cors({
    origin: [config.cors.clientUrl, config.cors.adminUrl],
    credentials: true,
  })
);

// Rate limiting
app.use(
  '/api/',
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: { success: false, message: 'Too many requests', data: null },
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookie.secret));
app.use(compression());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(uploadsDir));

// API Docs
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: config.env,
    },
  });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/site-visits', siteVisitRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize
const start = async (): Promise<void> => {
  try {
    await connectDB();
    
    // Initialize Redis
    try {
      logger.info('Initializing Redis connection...');
      const redis = getRedis();
      // Add a small delay to allow Redis events to fire
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      logger.error('Redis initialization error:', err.message || err);
    }

    initSocket(server);

    try {
      initWorkers();
    } catch (err) {
      logger.warn('BullMQ workers initialization failed (Redis may not be available):', err);
    }

    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} [${config.env}]`);
      logger.info(`API Docs: http://localhost:${config.port}/api-docs`);
      logger.info(`Health: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err);
});

start();

export default app;

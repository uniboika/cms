import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { initDatabase, sequelize } from './config/database';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Total-Count']
};

app.use(cors(corsOptions));

// Body parser middleware with increased limit for file uploads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const dbStatus = sequelize ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Database and server initialization
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    // Initialize database first
    await initDatabase();
    
    // Register routes
    await registerRoutes(app);

    // 404 handler (must be after routes)
    app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: 'error',
        message: 'Not Found',
        path: req.originalUrl
      });
    });
    
    // Global error handler
    app.use(errorHandler);
    
    // Start server after routes are registered
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
      console.log(`💻 Health check: http://localhost:${PORT}/health`);
      console.log(`🔒 Login endpoint: http://localhost:${PORT}/api/auth/login`);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error;
      
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    });

    // Graceful shutdown handler
    const gracefulShutdown = () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });

      // Force close server after 5 seconds
      setTimeout(() => {
        console.error('Forcing server shutdown');
        process.exit(1);
      }, 5000);
    };

    // Handle process termination
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Consider logging to an error tracking service here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Mandatory (as per the Node.js docs)
});

// Handle unhandled promise rejections in the future
process.on('warning', (warning) => {
  console.warn('Node.js Warning:', warning);
});
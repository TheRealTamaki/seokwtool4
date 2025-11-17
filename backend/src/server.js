const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection, syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const keywordRoutes = require('./routes/keywords');
const seoRoutes = require('./routes/seo');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api', limiter);

// Strict rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later'
});

app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SEO Keyword Research Tool API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/keywords', keywordRoutes);
app.use('/api/seo', seoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    // Sync database models
    await syncDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('  SEO Keyword Research Tool - Backend API');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`  Environment:  ${NODE_ENV}`);
      console.log(`  Server:       http://localhost:${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/health`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('  Available endpoints:');
      console.log('  • POST /api/auth/register    - Register new user');
      console.log('  • POST /api/auth/login       - Login user');
      console.log('  • GET  /api/auth/me          - Get current user');
      console.log('  • GET  /api/projects         - Get all projects');
      console.log('  • POST /api/projects         - Create project');
      console.log('  • POST /api/seo/research     - Keyword research');
      console.log('  • POST /api/seo/domain-keywords - Domain analysis');
      console.log('');
      console.log('  Press Cmd+C to stop');
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;

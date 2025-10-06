import { Pool } from 'pg';
import { logger } from './logger';

// Load environment variables
// require('dotenv').config();

// Database connection initialization logs
logger.info('🔍 Initializing database connection...');
logger.info('Environment check:');
logger.info('- NODE_ENV:', process.env.NODE_ENV);
logger.info('- AZURE_POSTGRES_CONNECTION_STRING:', process.env.AZURE_POSTGRES_CONNECTION_STRING ? 'SET' : 'NOT SET');

if (!process.env.AZURE_POSTGRES_CONNECTION_STRING) {
  logger.error('❌ Database connection string is not configured');
  throw new Error('Database connection string is not configured');
}

logger.info('✅ Environment variables loaded successfully');

// Create database pool
logger.info('🔗 Creating database connection pool...');
const pool = new Pool({
  connectionString: process.env.AZURE_POSTGRES_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Required for Azure Database for PostgreSQL
  }
});

logger.info('📊 Database pool created successfully');

// Test database connection
logger.info('🧪 Testing database connection...');
pool.query('SELECT 1 as test, NOW() as current_time, version() as db_version')
  .then(result => {
    logger.info('✅ Database connected successfully!');
    logger.info('📊 Connection test result:', result.rows[0]);
    logger.info('🎉 Database is ready for operations');
  })
  .catch(err => {
    logger.error('❌ Database connection failed!');
    logger.error('Error message:', err.message);
    logger.error('Error code:', err.code);
    logger.error('Full error:', err);
  });

// Add connection event listeners
pool.on('connect', (client) => {
  logger.info('🔌 New client connected to database');
});

pool.on('error', (err) => {
  logger.error('❌ Database pool error:', err.message);
});

pool.on('remove', () => {
  logger.info('🔌 Client removed from database pool');
});

export default pool;

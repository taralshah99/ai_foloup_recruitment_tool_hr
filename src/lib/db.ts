import { Pool } from 'pg';
import { logger } from './logger';

if (!process.env.AZURE_POSTGRES_CONNECTION_STRING) {
  logger.error('Database connection string is not configured');
  throw new Error('Database connection string is not configured');
}

const pool = new Pool({
  connectionString: process.env.AZURE_POSTGRES_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Required for Azure Database for PostgreSQL
  }
});

export default pool;

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.AZURE_POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }, // Azure often requires SSL
});

export default pool; 

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// const caCert = fs.readFileSync('/home/azureuser/techifysolutions-ssl.crt').toString();

const pool = new Pool({
  connectionString: process.env.AZURE_POSTGRES_CONNECTION_STRING,
  ssl: false as any,
});

console.log(pool);

export default pool;

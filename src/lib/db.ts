import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const caCert = fs.readFileSync('/home/azureuser/techifysolutions-ssl.crt').toString();

const pool = new Pool({
  host: '10.1.0.17',
  port: 5432,
  user: 'hruser',
  password: 'T@chify$ol8m0s0!',
  database: 'hrtest',
  ssl: {
    ca: caCert,
    rejectUnauthorized: true
  } as any,
});

export default pool;

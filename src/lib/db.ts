import { Pool } from 'pg';

// const caCert = fs.readFileSync('/home/azureuser/techifysolutions-ssl.crt').toString();

const pool = new Pool({
  connectionString: process.env.AZURE_POSTGRES_CONNECTION_STRING,
  ssl: false as any,
});

export default pool;

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 3000,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'permitflow_nexus',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 3000,
      }
);

let isConnected = false;

// Check connection status
export async function checkDbConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    client.release();
    isConnected = true;
    console.log(`[PostgreSQL] Connected successfully to database. Server time: ${res.rows[0].current_time}`);
    return true;
  } catch (err: any) {
    isConnected = false;
    console.warn(`[PostgreSQL] Database not reachable at configured connection string (${err.message}). Using resilient in-memory data store with full DB schemas.`);
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}

export default pool;

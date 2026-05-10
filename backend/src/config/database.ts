import { Pool, PoolConfig, PoolClient } from 'pg';
import { config } from './index';
import { logger } from '../utils/logger';

const poolConfig: PoolConfig = {
  connectionString: config.database.url,
  min: config.database.poolMin,
  max: config.database.poolMax,
  idleTimeoutMillis: config.database.idleTimeoutMs,
  connectionTimeoutMillis: config.database.connectionTimeoutMs,
  ssl:
    config.isProduction
      ? { rejectUnauthorized: false }
      : false,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  logger.debug('New database client connected');
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle database client', { error: err.message });
});

/**
 * Execute a query against the pool.
 * Returns rows typed as T[].
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: result.rowCount });
    return result.rows as T[];
  } catch (error) {
    const err = error as Error;
    logger.error('Database query error', { text, error: err.message });
    throw error;
  }
}

/**
 * Execute a query and return only the first row, or null.
 */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/**
 * Acquire a client for transaction usage.
 * Always call client.release() in a finally block.
 */
export async function getClient(): Promise<PoolClient> {
  return pool.connect();
}

/**
 * Execute a callback inside a transaction.
 * Commits on success, rolls back on error.
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test the database connection.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const rows = await query<{ now: Date }>('SELECT NOW() AS now');
    logger.info('Database connection established', { serverTime: rows[0]?.now });
    return true;
  } catch (error) {
    const err = error as Error;
    logger.warn('Database connection failed', { error: err.message });
    return false;
  }
}

/**
 * Gracefully close all pool connections.
 */
export async function closePool(): Promise<void> {
  await pool.end();
  logger.info('Database pool closed');
}

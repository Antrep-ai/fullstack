// ─────────────────────────────────────────────────────────────────────────────
// src/db/index.js
// Drizzle ORM client connected to Neon PostgreSQL via serverless driver
// ─────────────────────────────────────────────────────────────────────────────

import { neon }   from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'
import { logger }  from '../utils/logger.js'

if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL is not set. Check your .env file.')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === 'development',
})

// Quick ping to verify connectivity at startup
export async function verifyDbConnection() {
  try {
    await sql`SELECT 1`
    logger.success('✓ Connected to Neon PostgreSQL')
  } catch (err) {
    logger.error('✗ Neon PostgreSQL connection failed:', err.message)
    process.exit(1)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// src/routes/health.js
// GET /api/health — verifies server + DB are alive
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express'
import { db }     from '../db/index.js'
import { sql }    from 'drizzle-orm'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`)
    res.json({
      success:     true,
      status:      'healthy',
      service:     'antrep-backend',
      version:     '1.0.0',
      database:    'connected',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp:   new Date().toISOString(),
    })
  } catch {
    res.status(503).json({
      success:  false,
      status:   'unhealthy',
      database: 'disconnected',
    })
  }
})

export default router

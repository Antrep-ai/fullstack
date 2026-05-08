// ─────────────────────────────────────────────────────────────────────────────
// src/index.js
// Antrep Backend — Express server entry point
// Neon PostgreSQL + Drizzle ORM + Supabase Auth verification
// ─────────────────────────────────────────────────────────────────────────────

import 'dotenv/config'
import express     from 'express'
import cors        from 'cors'

import { logger }          from './utils/logger.js'
import { apiRegistry }     from './utils/apiRegistry.js'
import { verifyDbConnection } from './db/index.js'
import { requestLogger }   from './middleware/requestLogger.js'
import { errorHandler }    from './middleware/errorHandler.js'

// ─── Route modules ────────────────────────────────────────────────────────────
import healthRouter   from './routes/health.js'
import registerRouter from './routes/register.js'
import profileRouter  from './routes/profile.js'
import webhookRouter  from './routes/webhook.js'
import trackerRouter  from './routes/tracker.js'

const app  = express()
const PORT = process.env.PORT ?? 4001

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      [process.env.FRONTEND_URL ?? 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods:     ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}))

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── HTTP request logger (feeds ApiRegistry) ──────────────────────────────────
app.use(requestLogger)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/health',           healthRouter)
app.use('/api/register-profile', registerRouter)
app.use('/api/profile',          profileRouter)
app.use('/api/webhooks/supabase', webhookRouter)
app.use('/api/tracker',          trackerRouter)

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// ─── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler)

// ─── Startup sequence ─────────────────────────────────────────────────────────
async function bootstrap() {
  // 1. Verify Neon DB connection
  await verifyDbConnection()

  // 2. Start HTTP server
  app.listen(PORT, () => {
    logger.success(`✓ Antrep Backend running on http://localhost:${PORT}`)
    logger.info(`  Environment : ${process.env.NODE_ENV ?? 'development'}`)
    logger.info(`  CORS origin : ${process.env.FRONTEND_URL ?? 'http://localhost:3000'}`)

    // 3. Auto-discover all registered routes and seed the ApiRegistry
    const discovered = apiRegistry.discoverRoutes(app)
    logger.info(`  Routes found: ${discovered.length}`)
    discovered.forEach(r => logger.debug(`   ↳ ${r}`))

    logger.info(`\n  📊 API Tracker  → http://localhost:${PORT}/api/tracker`)
    logger.info(`  💚 Health check → http://localhost:${PORT}/api/health\n`)
  })
}

bootstrap().catch(err => {
  logger.error('Fatal startup error:', err.message)
  process.exit(1)
})

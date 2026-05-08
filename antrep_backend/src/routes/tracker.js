// ─────────────────────────────────────────────────────────────────────────────
// src/routes/tracker.js
// GET /api/tracker — live API stats dashboard (JSON)
// ─────────────────────────────────────────────────────────────────────────────

import { Router }      from 'express'
import { apiRegistry } from '../utils/apiRegistry.js'

const router = Router()

/**
 * GET /api/tracker
 * Returns a full snapshot of:
 *   - All registered routes (auto-discovered)
 *   - Hit counts, error rates, avg response times per route
 *   - Rolling log of last 50 API calls
 *   - Global stats (total calls, success rate, avg response time)
 *   - Server uptime
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data:    apiRegistry.getSummary(),
  })
})

export default router

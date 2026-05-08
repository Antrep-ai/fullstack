// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/requestLogger.js
// Logs every HTTP request and feeds the ApiRegistry for the tracker dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { logger }      from '../utils/logger.js'
import { apiRegistry } from '../utils/apiRegistry.js'

export function requestLogger(req, res, next) {
  const startMs = Date.now()

  // Intercept response finish to capture status + duration
  res.on('finish', () => {
    const ms     = Date.now() - startMs
    const method = req.method
    const path   = req.route?.path ?? req.path
    const status = res.statusCode

    logger.http(method, req.originalUrl, status, ms)
    apiRegistry.record({ method, path, status, ms })
  })

  next()
}

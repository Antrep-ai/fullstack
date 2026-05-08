// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/errorHandler.js
// Global Express error handler — catches all unhandled errors
// ─────────────────────────────────────────────────────────────────────────────

import { logger } from '../utils/logger.js'

/**
 * Central error handler. Must be registered LAST via app.use(errorHandler).
 */
export function errorHandler(err, req, res, _next) {
  logger.error(`${req.method} ${req.originalUrl} →`, err.message)

  // Zod validation errors surface as ZodError
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error:   'Validation failed',
      details: err.errors.map(e => ({
        field:   e.path.join('.'),
        message: e.message,
      })),
    })
  }

  // Duplicate key from Postgres
  if (err.code === '23505') {
    const detail = err.detail ?? ''
    const field  = detail.match(/\(([^)]+)\)/)?.[1] ?? 'field'
    return res.status(409).json({
      success: false,
      error:   `${field} is already taken`,
    })
  }

  // Generic fallback
  const status = err.statusCode ?? err.status ?? 500
  res.status(status).json({
    success: false,
    error:   process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
}

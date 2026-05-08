// ─────────────────────────────────────────────────────────────────────────────
// src/utils/apiRegistry.js
// Auto-discovers Express routes & tracks live API call stats
// Access via GET /api/tracker
// ─────────────────────────────────────────────────────────────────────────────

class ApiRegistry {
  constructor() {
    this._routes   = new Map()   // "METHOD /path" → stats object
    this._log      = []          // Rolling call log (last 200)
    this._start    = Date.now()
    this._MAX_LOG  = 200
  }

  // ─── Called from src/index.js after all app.use() calls ──────────────────
  discoverRoutes(app, prefix = '/api') {
    const found = []

    const walk = (stack, base = '') => {
      for (const layer of stack ?? []) {
        if (layer.route) {
          const fullPath = (base + (layer.route.path || '')).replace(/\/+/g, '/')
          const methods  = Object.keys(layer.route.methods).map(m => m.toUpperCase())
          methods.forEach(method => {
            const key = `${method} ${fullPath}`
            if (!this._routes.has(key)) {
              this._routes.set(key, {
                method,
                path:          fullPath,
                hitCount:      0,
                errorCount:    0,
                totalMs:       0,
                lastCalledAt:  null,
                registeredAt:  new Date().toISOString(),
              })
              found.push(key)
            }
          })
        } else if (layer.handle?.stack) {
          // Sub-router — extract mounted path from regexp
          let mountPath = ''
          if (layer.regexp?.source) {
            const m = layer.regexp.source.match(/\^\\\/([^\\?]+)/)
            if (m) mountPath = '/' + m[1].replace(/\\\//g, '/')
          }
          walk(layer.handle.stack, base + mountPath)
        }
      }
    }

    if (app._router) walk(app._router.stack)
    return found
  }

  // ─── Called by requestLogger middleware ───────────────────────────────────
  record({ method, path, status, ms }) {
    const key   = `${method} ${path}`
    const entry = this._routes.get(key)
    if (entry) {
      entry.hitCount++
      entry.totalMs      += ms
      entry.lastCalledAt  = new Date().toISOString()
      if (status >= 400) entry.errorCount++
    }

    this._log.push({ method, path, status, ms, at: new Date().toISOString() })
    if (this._log.length > this._MAX_LOG) this._log.shift()
  }

  // ─── Full tracker payload ─────────────────────────────────────────────────
  getSummary() {
    const routes = Array.from(this._routes.values()).map(r => ({
      ...r,
      avgMs:      r.hitCount ? Math.round(r.totalMs / r.hitCount) : null,
      errorRate:  r.hitCount ? `${((r.errorCount / r.hitCount) * 100).toFixed(1)}%` : '0%',
    })).sort((a, b) => b.hitCount - a.hitCount)

    const total  = this._log.length
    const errors = this._log.filter(c => c.status >= 400).length
    const avgMs  = total ? Math.round(this._log.reduce((s, c) => s + c.ms, 0) / total) : 0

    const uptimeSec  = Math.floor((Date.now() - this._start) / 1000)
    const hh = Math.floor(uptimeSec / 3600)
    const mm = Math.floor((uptimeSec % 3600) / 60)
    const ss = uptimeSec % 60

    return {
      meta: {
        serverStartedAt:       new Date(this._start).toISOString(),
        uptime:                `${hh}h ${mm}m ${ss}s`,
        environment:           process.env.NODE_ENV ?? 'development',
        totalRoutesRegistered: routes.length,
      },
      globalStats: {
        totalCallsTracked:    total,
        totalErrors:          errors,
        successRate:          total ? `${(((total - errors) / total) * 100).toFixed(1)}%` : 'N/A',
        avgResponseTimeMs:    avgMs,
      },
      routes,
      recentCalls: [...this._log].reverse().slice(0, 50),
    }
  }
}

export const apiRegistry = new ApiRegistry()

// ─────────────────────────────────────────────────────────────────────────────
// src/utils/logger.js
// Structured console logger with timestamps and colour levels
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  reset:   '\x1b[0m',
  grey:    '\x1b[90m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  cyan:    '\x1b[36m',
  magenta: '\x1b[35m',
  bold:    '\x1b[1m',
}

function ts() {
  return new Date().toISOString().replace('T', ' ').slice(0, 23)
}

function fmt(level, color, ...args) {
  const prefix = `${COLORS.grey}[${ts()}]${COLORS.reset} ${color}${COLORS.bold}${level}${COLORS.reset}`
  console.log(prefix, ...args)
}

export const logger = {
  info:    (...a) => fmt('INFO ', COLORS.cyan,    ...a),
  success: (...a) => fmt('OK   ', COLORS.green,   ...a),
  warn:    (...a) => fmt('WARN ', COLORS.yellow,  ...a),
  error:   (...a) => fmt('ERROR', COLORS.red,     ...a),
  debug:   (...a) => {
    if (process.env.NODE_ENV === 'development') fmt('DEBUG', COLORS.grey, ...a)
  },
  http:    (method, path, status, ms) => {
    const color = status >= 500 ? COLORS.red
                : status >= 400 ? COLORS.yellow
                : COLORS.green
    console.log(
      `${COLORS.grey}[${ts()}]${COLORS.reset} ${COLORS.magenta}${COLORS.bold}HTTP ${COLORS.reset}`,
      `${color}${status}${COLORS.reset}`,
      `${COLORS.bold}${method.padEnd(6)}${COLORS.reset}`,
      path,
      `${COLORS.grey}${ms}ms${COLORS.reset}`,
    )
  },
}

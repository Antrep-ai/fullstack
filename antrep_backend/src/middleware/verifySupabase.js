// ─────────────────────────────────────────────────────────────────────────────
// src/middleware/verifySupabase.js
// Verifies the Bearer JWT from Supabase Auth before allowing profile writes
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'
import { logger }       from '../utils/logger.js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logger.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env')
  process.exit(1)
}

// Admin client — uses service role key, never exposed to the browser
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

/**
 * verifySupabaseToken — Express middleware
 * Extracts the Bearer token from Authorization header,
 * verifies it with Supabase, and attaches req.supabaseUser.
 */
export async function verifySupabaseToken(req, res, next) {
  const auth = req.headers.authorization ?? ''

  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error:   'Missing Authorization header. Expected: Bearer <token>',
    })
  }

  const token = auth.slice(7)

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' })
    }
    req.supabaseUser = user   // { id, email, ... }
    next()
  } catch (err) {
    logger.error('Token verification error:', err.message)
    return res.status(500).json({ success: false, error: 'Token verification failed' })
  }
}

export { supabaseAdmin }

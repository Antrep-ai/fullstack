// ─────────────────────────────────────────────────────────────────────────────
// src/routes/webhook.js
// POST /api/webhooks/supabase
// Receives Supabase Auth events — flips user status to 'active' on email verify
// ─────────────────────────────────────────────────────────────────────────────

import { Router }        from 'express'
import { eq }            from 'drizzle-orm'
import { db }            from '../db/index.js'
import { userProfiles }  from '../db/schema.js'
import { logger }        from '../utils/logger.js'

const router = Router()

/**
 * Supabase sends webhooks as JSON with these shapes (v2 Auth Hooks):
 *   event: "email.confirmed" | "user.updated" | ...
 *   user:  { id, email, email_confirmed_at, ... }
 *
 * Setup in Supabase: Dashboard → Auth → Hooks → "Email confirmed" event
 *   URL: https://your-backend.com/api/webhooks/supabase
 *
 * Local dev: Use ngrok to expose localhost:4001 and set that as the webhook URL.
 */
router.post('/', async (req, res) => {
  try {
    const body = req.body

    // Supabase v2 webhook payload
    const eventType = body?.event ?? body?.type ?? ''
    const user      = body?.user  ?? body?.record ?? null

    logger.info(`Supabase webhook received: ${eventType}`)

    // Handle email confirmation event
    if (
      (eventType === 'email.confirmed' || eventType === 'EMAIL_CONFIRMED' || eventType === 'SIGNED_IN') &&
      user?.id &&
      user?.email_confirmed_at
    ) {
      const updated = await db
        .update(userProfiles)
        .set({ status: 'active', updatedAt: new Date() })
        .where(eq(userProfiles.supabaseUserId, user.id))
        .returning({ id: userProfiles.id, status: userProfiles.status })

      if (updated.length > 0) {
        logger.success(`User ${user.id} status → active (email verified)`)
        return res.json({ success: true, message: 'User status updated to active' })
      } else {
        logger.warn(`Webhook: No user_profile found for supabase_user_id ${user.id}`)
        return res.json({ success: true, message: 'No matching profile found (may not have registered yet)' })
      }
    }

    // Acknowledge other events gracefully
    res.json({ success: true, message: `Event '${eventType}' acknowledged — no action taken` })
  } catch (err) {
    logger.error('Supabase webhook error:', err.message)
    res.status(500).json({ success: false, error: 'Webhook processing failed' })
  }
})

export default router

// ─────────────────────────────────────────────────────────────────────────────
// src/routes/profile.js
// GET  /api/profile/me  — fetch own profile
// PATCH /api/profile/me — update own profile (status, mobile, etc.)
// All routes require a valid Supabase JWT
// ─────────────────────────────────────────────────────────────────────────────

import { Router }                      from 'express'
import { eq }                          from 'drizzle-orm'
import { db }                          from '../db/index.js'
import { userProfiles, ROLE_TABLE_MAP } from '../db/schema.js'
import { verifySupabaseToken }         from '../middleware/verifySupabase.js'
import { logger }                      from '../utils/logger.js'

const router = Router()

// All profile routes require a valid token
router.use(verifySupabaseToken)

// ─── GET /api/profile/me ──────────────────────────────────────────────────────
router.get('/me', async (req, res, next) => {
  try {
    const supabaseUserId = req.supabaseUser.id

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.supabaseUserId, supabaseUserId))
      .limit(1)

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' })
    }

    // Fetch role-specific table data
    const roleTable   = ROLE_TABLE_MAP[profile.role]
    const [roleProfile] = await db
      .select()
      .from(roleTable)
      .where(eq(roleTable.userProfileId, profile.id))
      .limit(1)

    res.json({
      success: true,
      data: { profile, roleProfile: roleProfile ?? null },
    })
  } catch (err) {
    next(err)
  }
})

// ─── PATCH /api/profile/me ────────────────────────────────────────────────────
router.patch('/me', async (req, res, next) => {
  try {
    const supabaseUserId = req.supabaseUser.id

    // Allowed fields to update on user_profiles
    const ALLOWED = ['mobileNumber', 'firstName', 'lastName', 'username', 'status']
    const updates  = {}
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    // Prevent escalating to an invalid status
    const VALID_STATUSES = ['pending_email_verification', 'active', 'blocked', 'deleted']
    if (updates.status && !VALID_STATUSES.includes(updates.status)) {
      return res.status(400).json({ success: false, error: `Invalid status: ${updates.status}` })
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields provided for update' })
    }

    updates.updatedAt = new Date()

    const [updated] = await db
      .update(userProfiles)
      .set(updates)
      .where(eq(userProfiles.supabaseUserId, supabaseUserId))
      .returning()

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Profile not found' })
    }

    logger.success(`Profile updated for ${supabaseUserId} — fields: ${Object.keys(updates).join(', ')}`)

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data:    updated,
    })
  } catch (err) {
    next(err)
  }
})

export default router

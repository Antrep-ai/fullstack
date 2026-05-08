// ─────────────────────────────────────────────────────────────────────────────
// src/routes/register.js
// POST /api/register-profile
// Called by frontend AFTER Supabase Auth signup succeeds
// ─────────────────────────────────────────────────────────────────────────────

import { Router }              from 'express'
import { eq, or }              from 'drizzle-orm'
import { db }                  from '../db/index.js'
import { userProfiles, ROLE_TABLE_MAP } from '../db/schema.js'
import { validate }            from '../validators/registerValidators.js'
import { logger }              from '../utils/logger.js'

const router = Router()

// ─── POST /api/register-profile ───────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    // 1. Validate with the role-specific Zod schema (throws ZodError if invalid)
    const data = validate(req.body.role, req.body)

    const {
      supabaseUserId, role, email, mobileNumber, username,
      firstName, lastName,
      ...roleData   // everything else goes to the role-specific table
    } = data

    // 2. Check uniqueness of email and username before inserting
    const existing = await db
      .select({ id: userProfiles.id, email: userProfiles.email, username: userProfiles.username })
      .from(userProfiles)
      .where(or(
        eq(userProfiles.email,    email),
        eq(userProfiles.username, username),
        eq(userProfiles.supabaseUserId, supabaseUserId),
      ))
      .limit(1)

    if (existing.length > 0) {
      const dup = existing[0]
      if (dup.email    === email)          return res.status(409).json({ success: false, error: 'Email is already registered' })
      if (dup.username === username)       return res.status(409).json({ success: false, error: 'Username is already taken' })
      return res.status(409).json({ success: false, error: 'This Supabase account already has a profile' })
    }

    // 3. Insert into user_profiles (common)
    const [profile] = await db
      .insert(userProfiles)
      .values({ supabaseUserId, role, email, mobileNumber, username, firstName, lastName })
      .returning()

    // 4. Build role-specific payload (strip common fields already stored above)
    const {
      supabaseUserId: _s, role: _r, email: _e,
      mobileNumber: _m, username: _u, firstName: _f, lastName: _l,
      ...specificData
    } = data

    // 5. Insert into the role-specific table
    const roleTable = ROLE_TABLE_MAP[role]
    const [roleProfile] = await db
      .insert(roleTable)
      .values({ userProfileId: profile.id, ...specificData })
      .returning()

    logger.success(`Registered [${role}] — ${email} — user_profile_id: ${profile.id}`)

    // 6. Return combined response
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email to continue.',
      data: {
        profile,
        roleProfile,
      },
    })

  } catch (err) {
    next(err)  // forwarded to errorHandler middleware
  }
})

export default router

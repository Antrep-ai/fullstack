// ─────────────────────────────────────────────────────────────────────────────
// src/db/schema.js
// Drizzle ORM schema — 7 tables for Antrep registration system
// ─────────────────────────────────────────────────────────────────────────────

import {
  pgTable, uuid, text, timestamp, numeric, integer, date,
} from 'drizzle-orm/pg-core'

// ─── Helper: standard audit timestamps ───────────────────────────────────────
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

// ─── Table 1: user_profiles ───────────────────────────────────────────────────
// Common table shared by all 6 user types
export const userProfiles = pgTable('user_profiles', {
  id:              uuid('id').primaryKey().defaultRandom(),
  supabaseUserId:  text('supabase_user_id').unique().notNull(),
  role:            text('role').notNull(),         // startup | investor | incubator | venture_capitalist | company | investment_banker
  email:           text('email').unique().notNull(),
  mobileNumber:    text('mobile_number'),
  firstName:       text('first_name'),
  lastName:        text('last_name'),
  username:        text('username').unique().notNull(),
  status:          text('status').default('pending_email_verification').notNull(),
  ...timestamps,
})

// ─── Table 2: startup_profiles ────────────────────────────────────────────────
export const startupProfiles = pgTable('startup_profiles', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  userProfileId:        uuid('user_profile_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  startupName:          text('startup_name').notNull(),
  founderName:          text('founder_name').notNull(),
  cofounderName:        text('cofounder_name'),
  startupStage:         text('startup_stage'),           // Idea Stage | MVP Stage | Early Revenue | Growth Stage | Funded | Scaling
  foundedDate:          date('founded_date'),
  totalRevenue:         numeric('total_revenue'),
  fundsRaised:          numeric('funds_raised'),
  address:              text('address'),
  country:              text('country'),
  website:              text('website'),
  linkedinUrl:          text('linkedin_url'),
  pitchDeckUrl:         text('pitch_deck_url'),
  targetMarket:         text('target_market'),
  problemStatement:     text('problem_statement'),
  solutionDescription:  text('solution_description'),
  competitorNames:      text('competitor_names'),
  usp:                  text('usp'),
  teamSize:             integer('team_size'),
  city:                 text('city'),
  ...timestamps,
})

// ─── Table 3: investor_profiles ───────────────────────────────────────────────
export const investorProfiles = pgTable('investor_profiles', {
  id:                        uuid('id').primaryKey().defaultRandom(),
  userProfileId:             uuid('user_profile_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  numberOfInvestmentsRange:  text('number_of_investments_range'), // 1 to 5 | 6 to 10 | 11 to 50 | 51 to 100 | 100+
  firstName:                 text('first_name'),
  lastName:                  text('last_name'),
  linkedinUrl:               text('linkedin_url'),
  investmentThesis:          text('investment_thesis'),
  preferredSectors:          text('preferred_sectors'),
  preferredStages:           text('preferred_stages'),
  minTicketSizeInr:          numeric('min_ticket_size_inr'),
  maxTicketSizeInr:          numeric('max_ticket_size_inr'),
  preferredGeographies:      text('preferred_geographies'),
  portfolioCompanyNames:     text('portfolio_company_names'),
  ...timestamps,
})

// ─── Table 4: incubator_profiles ──────────────────────────────────────────────
export const incubatorProfiles = pgTable('incubator_profiles', {
  id:                     uuid('id').primaryKey().defaultRandom(),
  userProfileId:          uuid('user_profile_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  placeOfIncubator:       text('place_of_incubator'),
  startupsIncubatedCount: integer('startups_incubated_count'),
  incubatorName:          text('incubator_name'),
  firstName:              text('first_name'),
  lastName:               text('last_name'),
  website:                text('website'),
  focusSectors:           text('focus_sectors'),
  linkedinUrl:            text('linkedin_url'),
  ...timestamps,
})

// ─── Table 5: venture_capitalist_profiles ────────────────────────────────────
export const vcProfiles = pgTable('venture_capitalist_profiles', {
  id:                        uuid('id').primaryKey().defaultRandom(),
  userProfileId:             uuid('user_profile_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  numberOfInvestmentsRange:  text('number_of_investments_range'),
  firstName:                 text('first_name'),
  lastName:                  text('last_name'),
  firmName:                  text('firm_name'),
  linkedinUrl:               text('linkedin_url'),
  aum:                       text('aum'),
  preferredStages:           text('preferred_stages'),
  sectorFocus:               text('sector_focus'),
  investmentGeography:       text('investment_geography'),
  ...timestamps,
})

// ─── Table 6: company_profiles ────────────────────────────────────────────────
export const companyProfiles = pgTable('company_profiles', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  userProfileId:      uuid('user_profile_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  companyName:        text('company_name').notNull(),
  contactPersonName:  text('contact_person_name'),
  designation:        text('designation'),
  companyWebsite:     text('company_website'),
  industrySector:     text('industry_sector'),      // Technology | Healthcare | Financial Services | ...
  foundedDate:        date('founded_date'),
  annualRevenue:      numeric('annual_revenue'),
  address:            text('address'),
  country:            text('country'),
  linkedinUrl:        text('linkedin_url'),
  employeeCount:      integer('employee_count'),
  companyDescription: text('company_description'),
  ...timestamps,
})

// ─── Table 7: investment_banker_profiles ──────────────────────────────────────
export const investmentBankerProfiles = pgTable('investment_banker_profiles', {
  id:                        uuid('id').primaryKey().defaultRandom(),
  userProfileId:             uuid('user_profile_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  firmName:                  text('firm_name').notNull(),
  designation:               text('designation'),
  yearsOfExperienceRange:    text('years_of_experience_range'),  // 0 to 2 years | 3 to 5 years | ...
  numberOfDealsClosedRange:  text('number_of_deals_closed_range'),
  preferredDealType:         text('preferred_deal_type'),
  sectorFocus:               text('sector_focus'),
  linkedinUrl:               text('linkedin_url'),
  currentDealsCount:         integer('current_deals_count'),
  ...timestamps,
})

// ─── Role → table mapping (used by register route) ───────────────────────────
export const ROLE_TABLE_MAP = {
  startup:             startupProfiles,
  investor:            investorProfiles,
  incubator:           incubatorProfiles,
  venture_capitalist:  vcProfiles,
  company:             companyProfiles,
  investment_banker:   investmentBankerProfiles,
}

export const VALID_ROLES = Object.keys(ROLE_TABLE_MAP)

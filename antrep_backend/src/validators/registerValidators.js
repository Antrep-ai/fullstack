// ─────────────────────────────────────────────────────────────────────────────
// src/validators/registerValidators.js
// Zod schemas for each of the 6 registration roles
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod'

// ─── Shared base fields (present in every registration) ──────────────────────
const baseSchema = z.object({
  supabaseUserId: z.string().uuid('Invalid Supabase user ID'),
  role:           z.enum(['startup', 'investor', 'incubator', 'venture_capitalist', 'company', 'investment_banker']),
  email:          z.string().email('Invalid email address'),
  mobileNumber:   z.string().min(7, 'Mobile number is required').max(20),
  username:       z.string()
                    .min(3,  'Username must be at least 3 characters')
                    .max(30, 'Username must be under 30 characters')
                    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores'),
  firstName:      z.string().optional(),
  lastName:       z.string().optional(),
})

const optionalUrl = z.string().url().optional().or(z.literal(''))

// ─── Role-specific schemas ────────────────────────────────────────────────────
const startupSchema = baseSchema.extend({
  startupName:          z.string().min(1, 'Startup name is required'),
  founderName:          z.string().min(1, 'Founder name is required'),
  cofounderName:        z.string().optional(),
  startupStage:         z.enum(['Idea Stage', 'MVP Stage', 'Early Revenue', 'Growth Stage', 'Funded', 'Scaling']).optional(),
  foundedDate:          z.string().optional(),
  totalRevenue:         z.union([z.number(), z.string()]).optional(),
  fundsRaised:          z.union([z.number(), z.string()]).optional(),
  address:              z.string().optional(),
  country:              z.string().optional(),
  website:              optionalUrl,
  linkedinUrl:          optionalUrl,
  pitchDeckUrl:         optionalUrl,
  targetMarket:         z.string().optional(),
  problemStatement:     z.string().optional(),
  solutionDescription:  z.string().optional(),
  competitorNames:      z.string().optional(),
  usp:                  z.string().optional(),
  teamSize:             z.coerce.number().optional(),
  city:                 z.string().optional(),
})

const investorSchema = baseSchema.extend({
  firstName:                z.string().min(1, 'First name is required'),
  lastName:                 z.string().min(1, 'Last name is required'),
  numberOfInvestmentsRange: z.enum(['1 to 5', '6 to 10', '11 to 50', '51 to 100', '100+'], {
    errorMap: () => ({ message: 'Number of investments is required' }),
  }),
  linkedinUrl:              optionalUrl,
  investmentThesis:         z.string().optional(),
  preferredSectors:         z.string().optional(),
  preferredStages:          z.string().optional(),
  minTicketSizeInr:         z.coerce.number().optional(),
  maxTicketSizeInr:         z.coerce.number().optional(),
  preferredGeographies:     z.string().optional(),
  portfolioCompanyNames:    z.string().optional(),
  country:                  z.string().optional(),
})

const incubatorSchema = baseSchema.extend({
  firstName:              z.string().min(1, 'First name is required'),
  lastName:               z.string().min(1, 'Last name is required'),
  placeOfIncubator:       z.string().min(1, 'Place of incubator is required'),
  startupsIncubatedCount: z.coerce.number().int().min(0, 'Must be a non-negative number').optional(),
  incubatorName:          z.string().optional(),
  website:                optionalUrl,
  focusSectors:           z.string().optional(),
  linkedinUrl:            optionalUrl,
  country:                z.string().optional(),
})

const vcSchema = baseSchema.extend({
  firstName:                z.string().min(1, 'First name is required'),
  lastName:                 z.string().min(1, 'Last name is required'),
  numberOfInvestmentsRange: z.enum(['1 to 5', '6 to 10', '11 to 50', '51 to 100', '100+'], {
    errorMap: () => ({ message: 'Number of investments is required' }),
  }),
  firmName:                 z.string().optional(),
  linkedinUrl:              optionalUrl,
  aum:                      z.string().optional(),
  preferredStages:          z.string().optional(),
  sectorFocus:              z.string().optional(),
  investmentGeography:      z.string().optional(),
  country:                  z.string().optional(),
})

const companySchema = baseSchema.extend({
  companyName:        z.string().min(1, 'Company name is required'),
  contactPersonName:  z.string().min(1, 'Contact person name is required'),
  designation:        z.string().optional(),
  companyWebsite:     z.string().url('Invalid website URL').optional().or(z.literal('')),
  industrySector:     z.enum([
    'Technology', 'Healthcare', 'Financial Services', 'Consumer',
    'Manufacturing', 'Logistics', 'Renewable Energy', 'Education', 'Real Estate', 'Other',
  ]).optional(),
  foundedDate:          z.string().optional(),
  annualRevenue:        z.union([z.number(), z.string()]).optional(),
  address:              z.string().optional(),
  country:              z.string().optional(),
  linkedinUrl:          optionalUrl,
  employeeCount:        z.coerce.number().optional(),
  companyDescription:   z.string().optional(),
})

const investmentBankerSchema = baseSchema.extend({
  firstName:                z.string().min(1, 'First name is required'),
  lastName:                 z.string().min(1, 'Last name is required'),
  firmName:                 z.string().min(1, 'Firm name is required'),
  designation:              z.string().min(1, 'Designation is required'),
  yearsOfExperienceRange:   z.enum(['0 to 2 years', '3 to 5 years', '6 to 10 years', '10+ years']).optional(),
  numberOfDealsClosedRange: z.enum(['0 to 5', '6 to 10', '11 to 25', '26 to 50', '50+']).optional(),
  preferredDealType:        z.enum(['Private Equity', 'M&A', 'Structured Credit', 'Venture Capital', 'All']).optional(),
  sectorFocus:              z.enum([
    'Technology', 'Healthcare', 'Financial Services', 'Consumer',
    'Manufacturing', 'Logistics', 'Renewable Energy', 'Sector Agnostic',
  ]).optional(),
  linkedinUrl:              optionalUrl,
  country:                  z.string().optional(),
  currentDealsCount:        z.coerce.number().optional(),
})

// ─── Map role string → schema ─────────────────────────────────────────────────
export const ROLE_SCHEMAS = {
  startup:             startupSchema,
  investor:            investorSchema,
  incubator:           incubatorSchema,
  venture_capitalist:  vcSchema,
  company:             companySchema,
  investment_banker:   investmentBankerSchema,
}

/**
 * validate(role, body) — throws ZodError if invalid, returns parsed data if OK
 */
export function validate(role, body) {
  const schema = ROLE_SCHEMAS[role]
  if (!schema) throw new Error(`Unknown role: ${role}`)
  return schema.parse(body)
}

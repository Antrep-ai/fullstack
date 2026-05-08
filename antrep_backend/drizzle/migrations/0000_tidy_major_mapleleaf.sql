CREATE TABLE IF NOT EXISTS "company_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"company_name" text NOT NULL,
	"contact_person_name" text,
	"designation" text,
	"company_website" text,
	"industry_sector" text,
	"founded_date" date,
	"annual_revenue" numeric,
	"address" text,
	"country" text,
	"linkedin_url" text,
	"employee_count" integer,
	"company_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "incubator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"place_of_incubator" text,
	"startups_incubated_count" integer,
	"incubator_name" text,
	"first_name" text,
	"last_name" text,
	"website" text,
	"focus_sectors" text,
	"linkedin_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investment_banker_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"firm_name" text NOT NULL,
	"designation" text,
	"years_of_experience_range" text,
	"number_of_deals_closed_range" text,
	"preferred_deal_type" text,
	"sector_focus" text,
	"linkedin_url" text,
	"current_deals_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investor_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"number_of_investments_range" text,
	"first_name" text,
	"last_name" text,
	"linkedin_url" text,
	"investment_thesis" text,
	"preferred_sectors" text,
	"preferred_stages" text,
	"min_ticket_size_inr" numeric,
	"max_ticket_size_inr" numeric,
	"preferred_geographies" text,
	"portfolio_company_names" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "startup_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"startup_name" text NOT NULL,
	"founder_name" text NOT NULL,
	"cofounder_name" text,
	"startup_stage" text,
	"founded_date" date,
	"total_revenue" numeric,
	"funds_raised" numeric,
	"address" text,
	"country" text,
	"website" text,
	"linkedin_url" text,
	"pitch_deck_url" text,
	"target_market" text,
	"problem_statement" text,
	"solution_description" text,
	"competitor_names" text,
	"usp" text,
	"team_size" integer,
	"city" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_user_id" text NOT NULL,
	"role" text NOT NULL,
	"email" text NOT NULL,
	"mobile_number" text,
	"first_name" text,
	"last_name" text,
	"username" text NOT NULL,
	"status" text DEFAULT 'pending_email_verification' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_supabase_user_id_unique" UNIQUE("supabase_user_id"),
	CONSTRAINT "user_profiles_email_unique" UNIQUE("email"),
	CONSTRAINT "user_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venture_capitalist_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_profile_id" uuid NOT NULL,
	"number_of_investments_range" text,
	"first_name" text,
	"last_name" text,
	"firm_name" text,
	"linkedin_url" text,
	"aum" text,
	"preferred_stages" text,
	"sector_focus" text,
	"investment_geography" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "incubator_profiles" ADD CONSTRAINT "incubator_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investment_banker_profiles" ADD CONSTRAINT "investment_banker_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investor_profiles" ADD CONSTRAINT "investor_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "startup_profiles" ADD CONSTRAINT "startup_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venture_capitalist_profiles" ADD CONSTRAINT "venture_capitalist_profiles_user_profile_id_user_profiles_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

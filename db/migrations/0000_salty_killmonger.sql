CREATE SCHEMA "vss";
--> statement-breakpoint
CREATE TYPE "vss"."account_type" AS ENUM('client', 'workforce');--> statement-breakpoint
CREATE TABLE "vss"."account_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"account_type" "vss"."account_type" NOT NULL,
	"phone" text NOT NULL,
	"phone_verified_at" timestamp with time zone,
	"locale" text DEFAULT 'en' NOT NULL,
	"terms_accepted_at" timestamp with time zone NOT NULL,
	"terms_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_profiles_phone_unique" UNIQUE("phone"),
	CONSTRAINT "account_profiles_user_type_unique" UNIQUE("user_id","account_type"),
	CONSTRAINT "account_profiles_phone_e164" CHECK ("vss"."account_profiles"."phone" ~ '^[+][1-9][0-9]{7,14}$'),
	CONSTRAINT "account_profiles_terms_version_nonempty" CHECK (length(trim("vss"."account_profiles"."terms_version")) > 0),
	CONSTRAINT "account_profiles_locale_nonempty" CHECK (length(trim("vss"."account_profiles"."locale")) BETWEEN 2 AND 35)
);
--> statement-breakpoint
ALTER TABLE "vss"."account_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "vss"."client_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"account_type" "vss"."account_type" DEFAULT 'client' NOT NULL,
	"company" text NOT NULL,
	"company_role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_profiles_type_check" CHECK ("vss"."client_profiles"."account_type" = 'client'),
	CONSTRAINT "client_profiles_company_nonempty" CHECK (length(trim("vss"."client_profiles"."company")) > 0),
	CONSTRAINT "client_profiles_role_nonempty" CHECK (length(trim("vss"."client_profiles"."company_role")) > 0)
);
--> statement-breakpoint
ALTER TABLE "vss"."client_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "vss"."client_project_intakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"project_name" text NOT NULL,
	"epic" text NOT NULL,
	"outcome" text NOT NULL,
	"target_users" text NOT NULL,
	"timeline" text NOT NULL,
	"budget" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_project_intakes_required_fields" CHECK (length(trim("vss"."client_project_intakes"."project_name")) > 0 AND length(trim("vss"."client_project_intakes"."epic")) > 0 AND length(trim("vss"."client_project_intakes"."outcome")) > 0 AND length(trim("vss"."client_project_intakes"."target_users")) > 0 AND length(trim("vss"."client_project_intakes"."timeline")) > 0 AND length(trim("vss"."client_project_intakes"."budget")) > 0)
);
--> statement-breakpoint
ALTER TABLE "vss"."client_project_intakes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "vss"."workforce_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"account_type" "vss"."account_type" DEFAULT 'workforce' NOT NULL,
	"primary_role" text NOT NULL,
	"experience" text NOT NULL,
	"skills" text NOT NULL,
	"timezone" text NOT NULL,
	"location" text NOT NULL,
	"availability" text NOT NULL,
	"portfolio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workforce_profiles_type_check" CHECK ("vss"."workforce_profiles"."account_type" = 'workforce'),
	CONSTRAINT "workforce_profiles_required_fields" CHECK (length(trim("vss"."workforce_profiles"."primary_role")) > 0 AND length(trim("vss"."workforce_profiles"."experience")) > 0 AND length(trim("vss"."workforce_profiles"."skills")) > 0 AND length(trim("vss"."workforce_profiles"."timezone")) > 0 AND length(trim("vss"."workforce_profiles"."location")) > 0 AND length(trim("vss"."workforce_profiles"."availability")) > 0),
	CONSTRAINT "workforce_profiles_portfolio_url" CHECK ("vss"."workforce_profiles"."portfolio" IS NULL OR "vss"."workforce_profiles"."portfolio" ~ '^https?://[^[:space:]]+$')
);
--> statement-breakpoint
ALTER TABLE "vss"."workforce_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "vss"."account_profiles" ADD CONSTRAINT "account_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vss"."client_profiles" ADD CONSTRAINT "client_profiles_account_fk" FOREIGN KEY ("user_id","account_type") REFERENCES "vss"."account_profiles"("user_id","account_type") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vss"."client_project_intakes" ADD CONSTRAINT "client_project_intakes_user_id_client_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "vss"."client_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vss"."workforce_profiles" ADD CONSTRAINT "workforce_profiles_account_fk" FOREIGN KEY ("user_id","account_type") REFERENCES "vss"."account_profiles"("user_id","account_type") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_project_intakes_user_idx" ON "vss"."client_project_intakes" USING btree ("user_id");
import { sql } from "drizzle-orm";
import { check, foreignKey, index, pgSchema, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

// Reference only: Neon owns this table. Never generate migrations for neon_auth.
const authUser = pgSchema("neon_auth").table("user", { id: uuid("id").primaryKey() });
export const vss = pgSchema("vss");

export const accountType = vss.enum("account_type", ["client", "workforce"]);

const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

export const accountProfiles = vss.table("account_profiles", {
  userId: uuid("user_id").primaryKey().references(() => authUser.id, { onDelete: "cascade" }),
  accountType: accountType("account_type").notNull(),
  phone: text("phone").notNull().unique(),
  phoneVerifiedAt: timestamp("phone_verified_at", { withTimezone: true }),
  locale: text("locale").default("en").notNull(),
  termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }).notNull(),
  termsVersion: text("terms_version").notNull(),
  ...timestamps(),
}, (table) => [
  unique("account_profiles_user_type_unique").on(table.userId, table.accountType),
  check("account_profiles_phone_e164", sql`${table.phone} ~ '^[+][1-9][0-9]{7,14}$'`),
  check("account_profiles_terms_version_nonempty", sql`length(trim(${table.termsVersion})) > 0`),
  check("account_profiles_locale_nonempty", sql`length(trim(${table.locale})) BETWEEN 2 AND 35`),
]).enableRLS();

export const clientProfiles = vss.table("client_profiles", {
  userId: uuid("user_id").primaryKey(),
  accountType: accountType("account_type").default("client").notNull(),
  company: text("company").notNull(),
  companyRole: text("company_role").notNull(),
  ...timestamps(),
}, (table) => [
  foreignKey({ columns: [table.userId, table.accountType], foreignColumns: [accountProfiles.userId, accountProfiles.accountType], name: "client_profiles_account_fk" }).onDelete("cascade"),
  check("client_profiles_type_check", sql`${table.accountType} = 'client'`),
  check("client_profiles_company_nonempty", sql`length(trim(${table.company})) > 0`),
  check("client_profiles_role_nonempty", sql`length(trim(${table.companyRole})) > 0`),
]).enableRLS();

export const clientProjectIntakes = vss.table("client_project_intakes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => clientProfiles.userId, { onDelete: "cascade" }),
  projectName: text("project_name").notNull(),
  epic: text("epic").notNull(),
  outcome: text("outcome").notNull(),
  targetUsers: text("target_users").notNull(),
  timeline: text("timeline").notNull(),
  budget: text("budget").notNull(),
  ...timestamps(),
}, (table) => [
  index("client_project_intakes_user_idx").on(table.userId),
  check("client_project_intakes_required_fields", sql`length(trim(${table.projectName})) > 0 AND length(trim(${table.epic})) > 0 AND length(trim(${table.outcome})) > 0 AND length(trim(${table.targetUsers})) > 0 AND length(trim(${table.timeline})) > 0 AND length(trim(${table.budget})) > 0`),
]).enableRLS();

export const workforceProfiles = vss.table("workforce_profiles", {
  userId: uuid("user_id").primaryKey(),
  accountType: accountType("account_type").default("workforce").notNull(),
  primaryRole: text("primary_role").notNull(),
  experience: text("experience").notNull(),
  skills: text("skills").notNull(),
  timezone: text("timezone").notNull(),
  location: text("location").notNull(),
  availability: text("availability").notNull(),
  portfolio: text("portfolio"),
  ...timestamps(),
}, (table) => [
  foreignKey({ columns: [table.userId, table.accountType], foreignColumns: [accountProfiles.userId, accountProfiles.accountType], name: "workforce_profiles_account_fk" }).onDelete("cascade"),
  check("workforce_profiles_type_check", sql`${table.accountType} = 'workforce'`),
  check("workforce_profiles_required_fields", sql`length(trim(${table.primaryRole})) > 0 AND length(trim(${table.experience})) > 0 AND length(trim(${table.skills})) > 0 AND length(trim(${table.timezone})) > 0 AND length(trim(${table.location})) > 0 AND length(trim(${table.availability})) > 0`),
  check("workforce_profiles_portfolio_url", sql`${table.portfolio} IS NULL OR ${table.portfolio} ~ '^https?://[^[:space:]]+$'`),
]).enableRLS();

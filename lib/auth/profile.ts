import 'server-only';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { accountProfiles, clientProfiles, clientProjectIntakes, workforceProfiles } from '@/db/schema';
import type { OnboardingInput } from './validation';

export async function saveProfile(userId: string, input: OnboardingInput) {
  return getDb().transaction(async tx => {
    // A conflict on this user's id is an idempotent retry. A phone conflict is an error.
    const inserted = await tx.insert(accountProfiles).values({ userId, accountType: input.accountType,
      phone: input.phone, phoneVerifiedAt: new Date(), locale: input.locale, termsAcceptedAt: new Date(), termsVersion: '2026-09-10',
    }).onConflictDoNothing({ target: accountProfiles.userId }).returning({ userId: accountProfiles.userId });
    if (!inserted.length) return;
    if (input.accountType === 'client') {
      await tx.insert(clientProfiles).values({ userId, company: input.company, companyRole: input.role });
      await tx.insert(clientProjectIntakes).values({ userId, projectName: input.projectName, epic: input.epic,
        outcome: input.outcome, targetUsers: input.users, timeline: input.timeline, budget: input.budget });
    } else {
      await tx.insert(workforceProfiles).values({ userId, primaryRole: input.primaryRole,
        experience: input.experience, skills: input.skills, timezone: input.timezone,
        location: input.location, availability: input.availability, portfolio: input.portfolio || null });
    }
  });
}

export async function readProfile(userId: string) {
  const db = getDb();
  const [account] = await db.select({ accountType: accountProfiles.accountType, phone: accountProfiles.phone })
    .from(accountProfiles).where(eq(accountProfiles.userId, userId)).limit(1);
  if (!account) return null;
  if (account.accountType === 'client') {
    const [client] = await db.select({ company: clientProfiles.company }).from(clientProfiles)
      .where(eq(clientProfiles.userId, userId)).limit(1);
    const [intake] = await db.select({ projectName: clientProjectIntakes.projectName,
      epic: clientProjectIntakes.epic, timeline: clientProjectIntakes.timeline }).from(clientProjectIntakes)
      .where(eq(clientProjectIntakes.userId, userId)).orderBy(clientProjectIntakes.createdAt, clientProjectIntakes.id).limit(1);
    return { ...account, ...client, ...intake };
  }
  const [workforce] = await db.select({ primaryRole: workforceProfiles.primaryRole })
    .from(workforceProfiles).where(eq(workforceProfiles.userId, userId)).limit(1);
  return { ...account, ...workforce };
}

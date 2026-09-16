import { z } from 'zod';
import { isLocale } from '../../app/i18n/languages';

export const passwordSchema = z.string().min(8).max(128)
  .regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/);
export const phoneSchema = z.string().trim().transform(value => value.replace(/[\s()-]/g, ''))
  .pipe(z.string().regex(/^\+[1-9][0-9]{7,14}$/, 'Enter a valid mobile number with country code.'));
const field = z.string().trim().min(1, 'Please complete every required field before continuing.').max(500);
const common = {
  phone: phoneSchema,
  locale: z.string().refine(isLocale),
  agreed: z.literal(true, { error: 'Please accept the terms to create your account.' }),
};
export const onboardingSchema = z.discriminatedUnion('accountType', [
  z.object({ ...common, accountType: z.literal('client'), company: field, role: field,
    projectName: field, epic: field, outcome: field.max(5000), users: field, timeline: field, budget: field }),
  z.object({ ...common, accountType: z.literal('workforce'), primaryRole: field, experience: field,
    skills: field.max(5000), timezone: field, location: field, availability: field,
    portfolio: z.union([z.literal(''), z.url().max(2000).refine(value => /^https?:\/\//.test(value), 'Use an http or https portfolio URL.')]).optional(),
  }),
]);
export type OnboardingInput = z.infer<typeof onboardingSchema>;

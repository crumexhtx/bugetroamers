export const CONTACT_CATEGORIES = [
  'Estimate feedback',
  'Suggest a city',
  'Content correction',
  'Technical issue',
  'Other',
] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export interface ContactSubmission {
  name: string;
  email: string;
  category: ContactCategory;
  message: string;
  website: string;
  formStartedAt: number;
}

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 5_000,
  bodyBytes: 16_384,
  minimumFormTimeMs: 2_000,
  maximumFormTimeMs: 24 * 60 * 60 * 1_000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactValidationResult =
  | { success: true; data: ContactSubmission }
  | { success: false; reason: 'invalid' | 'spam' };

export function validateContactSubmission(
  input: unknown,
  now = Date.now(),
): ContactValidationResult {
  if (!isRecord(input)) return { success: false, reason: 'invalid' };

  const name = cleanText(input.name);
  const email = cleanText(input.email).toLowerCase();
  const category = cleanText(input.category);
  const message = cleanMultilineText(input.message);
  const website = cleanText(input.website);
  const formStartedAt = input.formStartedAt;

  if (website) return { success: false, reason: 'spam' };

  if (
    !name ||
    name.length > CONTACT_LIMITS.name ||
    !email ||
    email.length > CONTACT_LIMITS.email ||
    !EMAIL_PATTERN.test(email) ||
    !CONTACT_CATEGORIES.includes(category as ContactCategory) ||
    message.length < 10 ||
    message.length > CONTACT_LIMITS.message ||
    typeof formStartedAt !== 'number' ||
    !Number.isFinite(formStartedAt)
  ) {
    return { success: false, reason: 'invalid' };
  }

  const elapsed = now - formStartedAt;
  if (
    elapsed < CONTACT_LIMITS.minimumFormTimeMs ||
    elapsed > CONTACT_LIMITS.maximumFormTimeMs
  ) {
    return { success: false, reason: 'spam' };
  }

  return {
    success: true,
    data: {
      name,
      email,
      category: category as ContactCategory,
      message,
      website: '',
      formStartedAt,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim()
    : '';
}

function cleanMultilineText(value: unknown): string {
  return typeof value === 'string'
    ? value
        .replace(/\r\n?/g, '\n')
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
        .trim()
    : '';
}

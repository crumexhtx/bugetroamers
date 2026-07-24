import { describe, expect, it } from 'vitest';
import {
  CONTACT_CATEGORIES,
  CONTACT_LIMITS,
  validateContactSubmission,
} from './contactValidation';

const now = 1_800_000_000_000;

function validSubmission() {
  return {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    category: CONTACT_CATEGORIES[0],
    message: 'The estimate appears too low for these travel dates.',
    website: '',
    formStartedAt: now - 5_000,
  };
}

describe('contact submission validation', () => {
  it('normalizes and accepts a valid submission', () => {
    const result = validateContactSubmission(
      { ...validSubmission(), email: ' ADA@EXAMPLE.COM ' },
      now,
    );

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('ada@example.com');
  });

  it('rejects invalid fields and categories', () => {
    expect(
      validateContactSubmission(
        { ...validSubmission(), category: 'Billing', message: 'short' },
        now,
      ),
    ).toEqual({ success: false, reason: 'invalid' });
    expect(validateContactSubmission(null, now)).toEqual({
      success: false,
      reason: 'invalid',
    });
  });

  it('flags honeypot and implausible submission timing as spam', () => {
    expect(
      validateContactSubmission({ ...validSubmission(), website: 'bot' }, now),
    ).toEqual({ success: false, reason: 'spam' });
    expect(
      validateContactSubmission(
        { ...validSubmission(), formStartedAt: now - 100 },
        now,
      ),
    ).toEqual({ success: false, reason: 'spam' });
    expect(
      validateContactSubmission(
        {
          ...validSubmission(),
          formStartedAt: now - CONTACT_LIMITS.maximumFormTimeMs - 1,
        },
        now,
      ),
    ).toEqual({ success: false, reason: 'spam' });
  });

  it('enforces field length and type limits', () => {
    expect(
      validateContactSubmission(
        { ...validSubmission(), name: 'x'.repeat(CONTACT_LIMITS.name + 1) },
        now,
      ),
    ).toEqual({ success: false, reason: 'invalid' });
    expect(
      validateContactSubmission(
        { ...validSubmission(), formStartedAt: String(now - 5_000) },
        now,
      ),
    ).toEqual({ success: false, reason: 'invalid' });
  });
});

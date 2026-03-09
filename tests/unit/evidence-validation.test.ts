import { describe, expect, it } from 'vitest';
import { evidenceSchema } from '@/lib/validation/evidence';

describe('evidence validation', () => {
  it('accepts valid evidence input', () => {
    const parsed = evidenceSchema.safeParse({ type: 'note', title: 'Leak started 08:10' });
    expect(parsed.success).toBe(true);
  });

  it('rejects empty title', () => {
    const parsed = evidenceSchema.safeParse({ type: 'photo', title: '' });
    expect(parsed.success).toBe(false);
  });
});

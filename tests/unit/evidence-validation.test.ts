import { describe, expect, it } from 'vitest';
import { createEvidenceItem } from '@/lib/mission-engine';
import { isLocalDevicePath } from '@/lib/store/local-attachments';
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

  it('creates timestamped evidence items for storage', () => {
    const item = createEvidenceItem({
      missionRunId: 'run-1',
      userId: 'user-1',
      type: 'receipt',
      title: 'Emergency dehumidifier receipt'
    });

    expect(item.id).toMatch(/^e-/);
    expect(item.createdAt).toBeTruthy();
  });

  it('recognises device-local evidence paths', () => {
    expect(isLocalDevicePath('local-device://run-1-photo.jpg')).toBe(true);
    expect(isLocalDevicePath('demo/run-1/photo.jpg')).toBe(false);
  });
});

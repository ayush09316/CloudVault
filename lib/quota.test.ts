import { describe, expect, it } from 'vitest';
import {
  checkQuota,
  DEFAULT_QUOTA_BYTES,
  resolveQuota,
  sumSizes,
  usagePercentage,
} from '@/lib/quota';

const MB = 1024 * 1024;

describe('resolveQuota', () => {
  it('uses the stored per-user quota', () => {
    expect(resolveQuota(500 * MB)).toBe(500 * MB);
  });

  it('falls back to 2GB for missing or invalid values', () => {
    expect(resolveQuota(null)).toBe(DEFAULT_QUOTA_BYTES);
    expect(resolveQuota(undefined)).toBe(DEFAULT_QUOTA_BYTES);
    expect(resolveQuota(0)).toBe(DEFAULT_QUOTA_BYTES);
    expect(resolveQuota(-5)).toBe(DEFAULT_QUOTA_BYTES);
    expect(resolveQuota('10')).toBe(DEFAULT_QUOTA_BYTES);
  });
});

describe('sumSizes', () => {
  it('sums sizes and treats missing sizes (folders) as zero', () => {
    expect(sumSizes([{ size: 10 }, { size: null }, {}, { size: 5 }])).toBe(15);
  });

  it('returns 0 for no files', () => {
    expect(sumSizes([])).toBe(0);
  });
});

describe('checkQuota', () => {
  it('accepts an upload that fits', () => {
    const r = checkQuota(90 * MB, 10 * MB, 100 * MB);
    expect(r.ok).toBe(true);
    expect(r.remaining).toBe(10 * MB);
  });

  it('accepts an upload that lands exactly on the quota', () => {
    expect(checkQuota(90 * MB, 10 * MB, 100 * MB).ok).toBe(true);
  });

  it('rejects an upload that would exceed the quota by one byte', () => {
    expect(checkQuota(90 * MB, 10 * MB + 1, 100 * MB).ok).toBe(false);
  });

  it('reports zero remaining when already over quota', () => {
    const r = checkQuota(150 * MB, 1, 100 * MB);
    expect(r.ok).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it('uses the default quota when the user has none stored', () => {
    expect(checkQuota(0, DEFAULT_QUOTA_BYTES, null).ok).toBe(true);
    expect(checkQuota(1, DEFAULT_QUOTA_BYTES, null).ok).toBe(false);
  });
});

describe('usagePercentage', () => {
  it('computes against the per-user quota', () => {
    expect(usagePercentage(25 * MB, 100 * MB)).toBe(25);
  });

  it('caps at 100', () => {
    expect(usagePercentage(250 * MB, 100 * MB)).toBe(100);
  });
});

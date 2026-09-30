export const DEFAULT_QUOTA_BYTES = 2 * 1024 * 1024 * 1024;

export const resolveQuota = (quotaBytes: unknown): number =>
  typeof quotaBytes === 'number' &&
  Number.isFinite(quotaBytes) &&
  quotaBytes > 0
    ? quotaBytes
    : DEFAULT_QUOTA_BYTES;

export const sumSizes = (files: { size?: number | null }[]) =>
  files.reduce((acc, f) => acc + (typeof f.size === 'number' ? f.size : 0), 0);

export interface QuotaCheck {
  ok: boolean;
  used: number;
  quota: number;
  remaining: number;
}

export const checkQuota = (
  used: number,
  incoming: number,
  quotaBytes: unknown
): QuotaCheck => {
  const quota = resolveQuota(quotaBytes);
  const remaining = Math.max(quota - used, 0);
  return { ok: used + incoming <= quota, used, quota, remaining };
};

export const usagePercentage = (used: number, quotaBytes: unknown) => {
  const quota = resolveQuota(quotaBytes);
  return Number(Math.min((used / quota) * 100, 100).toFixed(2));
};

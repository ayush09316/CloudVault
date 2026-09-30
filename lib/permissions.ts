export type ShareRole = 'view' | 'edit';
export type AccessRole = 'owner' | ShareRole;

export interface PermissionFile {
  ownerId: string;
}

export interface ShareGrant {
  granteeEmail?: string | null;
  token?: string | null;
  role: ShareRole;
  expiresAt?: string | null;
}

export interface Principal {
  userId?: string | null;
  email?: string | null;
  token?: string | null;
  isAdmin?: boolean;
}

export const isShareActive = (share: ShareGrant, now: Date = new Date()) => {
  if (!share.expiresAt) return true;
  return new Date(share.expiresAt).getTime() > now.getTime();
};

const shareMatches = (share: ShareGrant, principal: Principal) => {
  if (principal.token && share.token) return share.token === principal.token;
  if (principal.email && share.granteeEmail) {
    return (
      share.granteeEmail.trim().toLowerCase() ===
      principal.email.trim().toLowerCase()
    );
  }
  return false;
};

export const resolveRole = (
  file: PermissionFile,
  principal: Principal,
  shares: ShareGrant[] = [],
  now: Date = new Date()
): AccessRole | null => {
  if (principal.userId && file.ownerId === principal.userId) return 'owner';

  let role: AccessRole | null = null;
  for (const share of shares) {
    if (!isShareActive(share, now) || !shareMatches(share, principal)) {
      continue;
    }
    if (share.role === 'edit') return 'edit';
    role = 'view';
  }

  if (!role && principal.isAdmin) return 'view';
  return role;
};

export const canRead = (
  file: PermissionFile,
  principal: Principal,
  shares: ShareGrant[] = [],
  now: Date = new Date()
): boolean => resolveRole(file, principal, shares, now) !== null;

export const canWrite = (
  file: PermissionFile,
  principal: Principal,
  shares: ShareGrant[] = [],
  now: Date = new Date()
): boolean => {
  const role = resolveRole(file, principal, shares, now);
  return role === 'owner' || role === 'edit';
};

export const canShare = (
  file: PermissionFile,
  principal: Principal,
  shares: ShareGrant[] = [],
  now: Date = new Date()
): boolean => resolveRole(file, principal, shares, now) === 'owner';

export const canDelete = (file: PermissionFile, principal: Principal) =>
  !!principal.userId && file.ownerId === principal.userId;

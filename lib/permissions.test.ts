import { describe, expect, it } from 'vitest';
import {
  canDelete,
  canRead,
  canShare,
  canWrite,
  isShareActive,
  PermissionFile,
  resolveRole,
  ShareGrant,
} from '@/lib/permissions';

const now = new Date('2026-09-30T12:00:00.000Z');
const past = '2026-09-29T12:00:00.000Z';
const future = '2026-10-30T12:00:00.000Z';

const file: PermissionFile = { ownerId: 'owner-1' };
const owner = { userId: 'owner-1', email: 'owner@example.com' };
const viewer = { userId: 'viewer-1', email: 'viewer@example.com' };
const editor = { userId: 'editor-1', email: 'Editor@Example.com' };
const stranger = { userId: 'stranger-1', email: 'stranger@example.com' };

const shares: ShareGrant[] = [
  { granteeEmail: 'viewer@example.com', role: 'view' },
  { granteeEmail: 'editor@example.com', role: 'edit' },
  { token: 'view-link', role: 'view', expiresAt: future },
  { token: 'edit-link', role: 'edit' },
  { token: 'expired-link', role: 'edit', expiresAt: past },
];

describe('isShareActive', () => {
  it('treats a share without expiry as active', () => {
    expect(isShareActive({ role: 'view' }, now)).toBe(true);
  });

  it('is active before expiresAt', () => {
    expect(isShareActive({ role: 'view', expiresAt: future }, now)).toBe(true);
  });

  it('is inactive at or after expiresAt', () => {
    expect(isShareActive({ role: 'view', expiresAt: past }, now)).toBe(false);
    expect(
      isShareActive({ role: 'view', expiresAt: now.toISOString() }, now)
    ).toBe(false);
  });
});

describe('resolveRole', () => {
  it('gives the owner full access with no shares at all', () => {
    expect(resolveRole(file, owner, [], now)).toBe('owner');
  });

  it('resolves an email grant case-insensitively', () => {
    expect(resolveRole(file, editor, shares, now)).toBe('edit');
    expect(resolveRole(file, viewer, shares, now)).toBe('view');
  });

  it('returns null for a user with no matching share', () => {
    expect(resolveRole(file, stranger, shares, now)).toBeNull();
  });

  it('resolves link tokens for anonymous visitors', () => {
    expect(resolveRole(file, { token: 'view-link' }, shares, now)).toBe('view');
    expect(resolveRole(file, { token: 'edit-link' }, shares, now)).toBe('edit');
  });

  it('rejects an expired link', () => {
    expect(resolveRole(file, { token: 'expired-link' }, shares, now)).toBe(
      null
    );
  });

  it('rejects an unknown token', () => {
    expect(resolveRole(file, { token: 'nope' }, shares, now)).toBeNull();
  });

  it('treats a revoked share (row deleted) as no access', () => {
    const revoked = shares.filter(
      (s) => s.granteeEmail !== 'editor@example.com'
    );
    expect(resolveRole(file, editor, revoked, now)).toBeNull();
  });

  it('picks the strongest of several active grants', () => {
    const both: ShareGrant[] = [
      { granteeEmail: 'viewer@example.com', role: 'view' },
      { granteeEmail: 'viewer@example.com', role: 'edit' },
    ];
    expect(resolveRole(file, viewer, both, now)).toBe('edit');
  });

  it('ignores an expired edit grant but keeps an active view grant', () => {
    const mixed: ShareGrant[] = [
      { granteeEmail: 'viewer@example.com', role: 'edit', expiresAt: past },
      { granteeEmail: 'viewer@example.com', role: 'view' },
    ];
    expect(resolveRole(file, viewer, mixed, now)).toBe('view');
  });

  it('does not let an email principal use a link-only share', () => {
    const linkOnly: ShareGrant[] = [{ token: 'edit-link', role: 'edit' }];
    expect(resolveRole(file, stranger, linkOnly, now)).toBeNull();
  });

  it('gives admins read-only access to files they do not own', () => {
    expect(resolveRole(file, { ...stranger, isAdmin: true }, [], now)).toBe(
      'view'
    );
  });
});

describe('canRead / canWrite / canShare / canDelete', () => {
  it('owner can do everything', () => {
    expect(canRead(file, owner, [], now)).toBe(true);
    expect(canWrite(file, owner, [], now)).toBe(true);
    expect(canShare(file, owner, [], now)).toBe(true);
    expect(canDelete(file, owner)).toBe(true);
  });

  it('view grant can read but not write, share or delete', () => {
    expect(canRead(file, viewer, shares, now)).toBe(true);
    expect(canWrite(file, viewer, shares, now)).toBe(false);
    expect(canShare(file, viewer, shares, now)).toBe(false);
    expect(canDelete(file, viewer)).toBe(false);
  });

  it('edit grant can read and write but not share or delete', () => {
    expect(canRead(file, editor, shares, now)).toBe(true);
    expect(canWrite(file, editor, shares, now)).toBe(true);
    expect(canShare(file, editor, shares, now)).toBe(false);
    expect(canDelete(file, editor)).toBe(false);
  });

  it('edit link can write, view link cannot', () => {
    expect(canWrite(file, { token: 'edit-link' }, shares, now)).toBe(true);
    expect(canWrite(file, { token: 'view-link' }, shares, now)).toBe(false);
  });

  it('expired edit link can neither read nor write', () => {
    expect(canRead(file, { token: 'expired-link' }, shares, now)).toBe(false);
    expect(canWrite(file, { token: 'expired-link' }, shares, now)).toBe(false);
  });

  it('stranger gets nothing', () => {
    expect(canRead(file, stranger, shares, now)).toBe(false);
    expect(canWrite(file, stranger, shares, now)).toBe(false);
    expect(canShare(file, stranger, shares, now)).toBe(false);
  });

  it('admin can read but not write someone else file', () => {
    const admin = { ...stranger, isAdmin: true };
    expect(canRead(file, admin, [], now)).toBe(true);
    expect(canWrite(file, admin, [], now)).toBe(false);
    expect(canDelete(file, admin)).toBe(false);
  });
});

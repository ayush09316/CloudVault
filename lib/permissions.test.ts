import { describe, expect, it } from 'vitest';
import { canRead, canShare, canWrite, PermissionFile } from '@/lib/permissions';

const ownerId = 'owner-1';
const grantedUserId = 'granted-1';
const strangerId = 'stranger-1';

const file: PermissionFile = {
  ownerId,
  sharedWith: [grantedUserId],
};

describe('canRead', () => {
  it('allows the owner', () => {
    expect(canRead(file, ownerId)).toBe(true);
  });

  it('allows a user granted access via sharedWith', () => {
    expect(canRead(file, grantedUserId)).toBe(true);
  });

  it('denies a user with no access', () => {
    expect(canRead(file, strangerId)).toBe(false);
  });

  it('denies a stranger when sharedWith is not set', () => {
    expect(canRead({ ownerId }, strangerId)).toBe(false);
  });
});

describe('canWrite', () => {
  it('allows the owner', () => {
    expect(canWrite(file, ownerId)).toBe(true);
  });

  it('denies a user with no access', () => {
    expect(canWrite(file, strangerId)).toBe(false);
  });

  it('denies a user only granted read access via sharedWith', () => {
    expect(canWrite(file, grantedUserId)).toBe(false);
  });
});

describe('canShare', () => {
  it('allows the owner', () => {
    expect(canShare(file, ownerId)).toBe(true);
  });

  it('denies a user with no access', () => {
    expect(canShare(file, strangerId)).toBe(false);
  });

  it('denies a user only granted read access via sharedWith', () => {
    expect(canShare(file, grantedUserId)).toBe(false);
  });
});

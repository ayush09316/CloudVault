import { describe, expect, it } from 'vitest';
import {
  buildBreadcrumbs,
  canMoveInto,
  FolderNode,
  isDescendantOrSelf,
  normalizeParentId,
  topLevelTrashed,
} from '@/lib/folders';

const nodes: FolderNode[] = [
  { $id: 'a', name: 'Projects', parentId: null },
  { $id: 'b', name: 'Client', parentId: 'a' },
  { $id: 'c', name: 'Invoices', parentId: 'b' },
  { $id: 'd', name: 'Photos', parentId: '' },
];
const folders = new Map(nodes.map((n) => [n.$id, n]));

describe('normalizeParentId', () => {
  it('maps empty string and undefined to null (root)', () => {
    expect(normalizeParentId('')).toBeNull();
    expect(normalizeParentId(undefined)).toBeNull();
    expect(normalizeParentId('x')).toBe('x');
  });
});

describe('buildBreadcrumbs', () => {
  it('returns just root at the top level', () => {
    expect(buildBreadcrumbs(null, folders)).toEqual([
      { id: null, name: 'My Files' },
    ]);
  });

  it('walks up to root for a nested folder', () => {
    expect(buildBreadcrumbs('c', folders)).toEqual([
      { id: null, name: 'My Files' },
      { id: 'a', name: 'Projects' },
      { id: 'b', name: 'Client' },
      { id: 'c', name: 'Invoices' },
    ]);
  });

  it('treats an empty-string parent as root', () => {
    expect(buildBreadcrumbs('d', folders).map((c) => c.name)).toEqual([
      'My Files',
      'Photos',
    ]);
  });

  it('stops at a missing ancestor instead of throwing', () => {
    const partial = new Map([['c', nodes[2]]]);
    expect(buildBreadcrumbs('c', partial).map((c) => c.id)).toEqual([
      null,
      'c',
    ]);
  });

  it('terminates on a cyclic parent chain', () => {
    const cyclic = new Map<string, FolderNode>([
      ['x', { $id: 'x', name: 'X', parentId: 'y' }],
      ['y', { $id: 'y', name: 'Y', parentId: 'x' }],
    ]);
    expect(buildBreadcrumbs('x', cyclic)).toHaveLength(3);
  });
});

describe('isDescendantOrSelf', () => {
  it('detects direct and deep descendants', () => {
    expect(isDescendantOrSelf('b', 'a', folders)).toBe(true);
    expect(isDescendantOrSelf('c', 'a', folders)).toBe(true);
    expect(isDescendantOrSelf('a', 'a', folders)).toBe(true);
  });

  it('is false for unrelated folders and root', () => {
    expect(isDescendantOrSelf('d', 'a', folders)).toBe(false);
    expect(isDescendantOrSelf(null, 'a', folders)).toBe(false);
  });
});

describe('canMoveInto', () => {
  it('allows moving a file anywhere that exists', () => {
    expect(canMoveInto('file-1', false, 'c', folders)).toBe(true);
    expect(canMoveInto('file-1', false, null, folders)).toBe(true);
  });

  it('refuses a target folder that does not exist', () => {
    expect(canMoveInto('file-1', false, 'missing', folders)).toBe(false);
  });

  it('refuses moving a folder into itself or its descendants', () => {
    expect(canMoveInto('a', true, 'a', folders)).toBe(false);
    expect(canMoveInto('a', true, 'c', folders)).toBe(false);
  });

  it('allows moving a folder to root or a sibling tree', () => {
    expect(canMoveInto('b', true, null, folders)).toBe(true);
    expect(canMoveInto('b', true, 'd', folders)).toBe(true);
  });
});

describe('topLevelTrashed', () => {
  it('hides items whose parent folder is also in the trash', () => {
    const trashed = [
      { $id: 'a', parentId: null },
      { $id: 'b', parentId: 'a' },
      { $id: 'f', parentId: 'b' },
      { $id: 'g', parentId: 'live-folder' },
    ];
    expect(topLevelTrashed(trashed).map((t) => t.$id)).toEqual(['a', 'g']);
  });
});

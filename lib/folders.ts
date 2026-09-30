export interface FolderNode {
  $id: string;
  name: string;
  parentId?: string | null;
}

export interface Crumb {
  id: string | null;
  name: string;
}

export const normalizeParentId = (parentId?: string | null) => parentId || null;

export const buildBreadcrumbs = (
  folderId: string | null | undefined,
  folders: Map<string, FolderNode>,
  rootName = 'My Files'
): Crumb[] => {
  const trail: Crumb[] = [];
  const seen = new Set<string>();
  let current = normalizeParentId(folderId);

  while (current && !seen.has(current)) {
    seen.add(current);
    const node = folders.get(current);
    if (!node) break;
    trail.unshift({ id: node.$id, name: node.name });
    current = normalizeParentId(node.parentId);
  }

  return [{ id: null, name: rootName }, ...trail];
};

export const isDescendantOrSelf = (
  candidateId: string | null | undefined,
  ancestorId: string,
  folders: Map<string, FolderNode>
) => {
  const seen = new Set<string>();
  let current = normalizeParentId(candidateId);

  while (current && !seen.has(current)) {
    if (current === ancestorId) return true;
    seen.add(current);
    current = normalizeParentId(folders.get(current)?.parentId);
  }
  return false;
};

export const canMoveInto = (
  itemId: string,
  itemIsFolder: boolean,
  targetParentId: string | null | undefined,
  folders: Map<string, FolderNode>
) => {
  const target = normalizeParentId(targetParentId);
  if (target === itemId) return false;
  if (target && !folders.has(target)) return false;
  if (!itemIsFolder || !target) return true;
  return !isDescendantOrSelf(target, itemId, folders);
};

export const topLevelTrashed = <
  T extends { $id: string; parentId?: string | null },
>(
  trashed: T[]
) => {
  const ids = new Set(trashed.map((t) => t.$id));
  return trashed.filter((t) => !t.parentId || !ids.has(t.parentId));
};

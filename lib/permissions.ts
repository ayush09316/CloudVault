export interface PermissionFile {
  ownerId: string;
  sharedWith?: string[];
}

export const canWrite = (file: PermissionFile, userId: string): boolean => {
  return file.ownerId === userId;
};

export const canShare = (file: PermissionFile, userId: string): boolean => {
  return file.ownerId === userId;
};

export const canRead = (file: PermissionFile, userId: string): boolean => {
  if (canWrite(file, userId)) return true;
  return file.sharedWith?.includes(userId) ?? false;
};

export const SIDEBAR_COOKIE = 'cv-sidebar';

export const initials = (name: string) =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('') || '?';

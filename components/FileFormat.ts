const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const time = (d: Date) => {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
};

export const formatShortDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return time(d);
  const label = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return d.getFullYear() === now.getFullYear()
    ? label
    : `${label}, ${d.getFullYear()}`;
};

export const formatFullDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${time(d)}`;
};

export const formatRelative = (iso?: string | null) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hrs = Math.round(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatShortDate(iso);
};

export const formatBytes = (bytes?: number | null) => {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
};

export const initials = (nameOrEmail?: string | null) => {
  const s = (nameOrEmail || '').trim();
  if (!s) return '?';
  const base = s.includes('@') ? s.split('@')[0].replace(/[._-]+/g, ' ') : s;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const TONES = [
  'bg-[#DCEBF7] text-[#24598F] dark:bg-[#1C3348] dark:text-[#9CC7EE]',
  'bg-[#DDF1E6] text-[#1D6B47] dark:bg-[#183A2A] dark:text-[#8FD9B3]',
  'bg-[#F6E6D3] text-[#8A5317] dark:bg-[#3E2C18] dark:text-[#EDBE85]',
  'bg-[#F3DDE8] text-[#8E3463] dark:bg-[#3D1D2E] dark:text-[#EDA3C8]',
  'bg-[#E4E0F6] text-[#4D3E9E] dark:bg-[#29244A] dark:text-[#B9AEF2]',
  'bg-[#E5E9E8] text-[#3E4A48] dark:bg-[#252C2B] dark:text-[#B7C2C0]',
];

export const avatarTone = (seed?: string | null) => {
  const s = (seed || '').toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
};

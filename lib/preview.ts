export type PreviewKind = 'image' | 'video' | 'audio' | 'pdf' | 'none';

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  avi: 'video/x-msvideo',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
  pdf: 'application/pdf',
  txt: 'text/plain; charset=utf-8',
  csv: 'text/csv; charset=utf-8',
};

const BROWSER_VIDEO = ['mp4', 'webm', 'mov'];
const BROWSER_AUDIO = ['mp3', 'wav', 'ogg', 'flac'];
const BROWSER_IMAGE = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

export const mimeForExtension = (extension?: string | null) =>
  MIME_BY_EXTENSION[(extension || '').toLowerCase()] ??
  'application/octet-stream';

export const getPreviewKind = (extension?: string | null): PreviewKind => {
  const ext = (extension || '').toLowerCase();
  if (BROWSER_IMAGE.includes(ext)) return 'image';
  if (BROWSER_VIDEO.includes(ext)) return 'video';
  if (BROWSER_AUDIO.includes(ext)) return 'audio';
  if (ext === 'pdf') return 'pdf';
  return 'none';
};

export const isThumbnailable = (extension?: string | null) =>
  ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(
    (extension || '').toLowerCase()
  );

export const fileContentUrl = (
  fileId: string,
  opts: { token?: string | null; download?: boolean } = {}
) => {
  const params = new URLSearchParams();
  if (opts.token) params.set('token', opts.token);
  if (opts.download) params.set('download', '1');
  const qs = params.toString();
  return `/api/files/${fileId}${qs ? `?${qs}` : ''}`;
};

export const thumbnailUrl = (fileId: string, token?: string | null) =>
  `/api/files/${fileId}/thumbnail${token ? `?token=${encodeURIComponent(token)}` : ''}`;

import { describe, expect, it } from 'vitest';
import {
  fileContentUrl,
  getPreviewKind,
  isThumbnailable,
  mimeForExtension,
} from '@/lib/preview';

describe('getPreviewKind', () => {
  it('dispatches by extension, case-insensitively', () => {
    expect(getPreviewKind('PNG')).toBe('image');
    expect(getPreviewKind('mp4')).toBe('video');
    expect(getPreviewKind('mp3')).toBe('audio');
    expect(getPreviewKind('pdf')).toBe('pdf');
  });

  it('falls back to none for formats browsers cannot render', () => {
    expect(getPreviewKind('docx')).toBe('none');
    expect(getPreviewKind('mkv')).toBe('none');
    expect(getPreviewKind('')).toBe('none');
    expect(getPreviewKind(undefined)).toBe('none');
  });
});

describe('isThumbnailable', () => {
  it('only accepts raster formats sharp can decode', () => {
    expect(isThumbnailable('jpg')).toBe(true);
    expect(isThumbnailable('svg')).toBe(false);
    expect(isThumbnailable('pdf')).toBe(false);
  });
});

describe('mimeForExtension', () => {
  it('maps known types and defaults to octet-stream', () => {
    expect(mimeForExtension('pdf')).toBe('application/pdf');
    expect(mimeForExtension('xyz')).toBe('application/octet-stream');
  });
});

describe('fileContentUrl', () => {
  it('builds same-origin content URLs with optional token and download', () => {
    expect(fileContentUrl('f1')).toBe('/api/files/f1');
    expect(fileContentUrl('f1', { token: 't', download: true })).toBe(
      '/api/files/f1?token=t&download=1'
    );
  });
});

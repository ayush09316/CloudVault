import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { mimeForExtension } from '@/lib/preview';
import { getFileAccess } from '@/lib/server/files';

const parseRange = (header: string | null, size: number) => {
  const match = header?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match) return null;
  let start = match[1] ? Number(match[1]) : NaN;
  let end = match[2] ? Number(match[2]) : size - 1;
  if (Number.isNaN(start)) {
    start = Math.max(size - end, 0);
    end = size - 1;
  }
  if (start > end || start >= size) return 'invalid' as const;
  return { start, end: Math.min(end, size - 1) };
};

export const serveFileContent = async (
  req: NextRequest,
  fileId: string,
  variant: 'original' | 'thumbnail'
) => {
  const token = req.nextUrl.searchParams.get('token');
  const access = await getFileAccess(fileId, { token });
  if (!access || access.file.isFolder || access.file.deletedAt) {
    return new NextResponse('Not found', { status: 404 });
  }

  const { file } = access;
  const useThumb = variant === 'thumbnail' && !!file.thumbnailBucketFileId;
  const bucketFileId = useThumb
    ? file.thumbnailBucketFileId!
    : file.bucketFileId;

  const { storage } = await createAdminClient();
  const bytes = Buffer.from(
    await storage.getFileView(appwriteConfig.bucketId, bucketFileId)
  );

  const headers = new Headers({
    'Content-Type': useThumb ? 'image/webp' : mimeForExtension(file.extension),
    'Cache-Control': 'private, max-age=300',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': 'sandbox',
    'Accept-Ranges': 'bytes',
  });

  const download = req.nextUrl.searchParams.get('download') === '1';
  headers.set(
    'Content-Disposition',
    `${download ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(file.name)}`
  );

  const range = parseRange(req.headers.get('range'), bytes.length);
  if (range === 'invalid') {
    headers.set('Content-Range', `bytes */${bytes.length}`);
    return new NextResponse(null, { status: 416, headers });
  }
  if (range) {
    headers.set(
      'Content-Range',
      `bytes ${range.start}-${range.end}/${bytes.length}`
    );
    headers.set('Content-Length', String(range.end - range.start + 1));
    return new NextResponse(bytes.subarray(range.start, range.end + 1), {
      status: 206,
      headers,
    });
  }

  headers.set('Content-Length', String(bytes.length));
  return new NextResponse(bytes, { status: 200, headers });
};

import { NextRequest } from 'next/server';
import { serveFileContent } from '@/lib/server/content';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return serveFileContent(req, id, 'original');
}

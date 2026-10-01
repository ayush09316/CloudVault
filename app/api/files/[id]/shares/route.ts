import { NextResponse } from 'next/server';
import { getFileShares } from '@/lib/actions/share.actions';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    return NextResponse.json(await getFileShares(id));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load shares' },
      { status: 403 }
    );
  }
}

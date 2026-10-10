import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const creator = db.getCreatorById(params.id);
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  const user = db.getUserById(creator.user_id);
  return NextResponse.json({ creator, user });
}

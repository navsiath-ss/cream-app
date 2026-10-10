import { NextRequest, NextResponse } from 'next/server';
import { generateDigiLockerAuthUrl } from '@/lib/digilocker';

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { url, state } = generateDigiLockerAuthUrl(userId, role || 'creator');
    return NextResponse.json({ authUrl: url, state });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

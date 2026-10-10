import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'user_client_demo';

  const user = db.getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const allUsers = db.getUsers();
  return NextResponse.json({ currentUser: user, allUsers });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, role, name, email } = body;

    if (userId) {
      const existing = db.getUserById(userId);
      if (existing) {
        return NextResponse.json({ user: existing });
      }
    }

    if (email && name) {
      const newUser = db.upsertUser({
        id: `user_${Date.now()}`,
        email,
        name,
        role: role || 'client',
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        is_digilocker_verified: false,
        created_at: new Date().toISOString(),
      });
      return NextResponse.json({ user: newUser });
    }

    return NextResponse.json({ error: 'Invalid user parameters' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

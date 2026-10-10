import { NextRequest, NextResponse } from 'next/server';
import { exchangeDigiLockerCode } from '@/lib/digilocker';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code') || 'demo_auth_code_meripehchan';
  const state = searchParams.get('state') || '';

  try {
    let userId = 'user_creator_arjun';
    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf-8'));
        userId = decoded.userId || userId;
      } catch (e) {
        // Fallback
      }
    }

    const verificationResult = await exchangeDigiLockerCode(code, state);
    db.updateDigiLockerStatus(userId, verificationResult.aadhaarTokenRef);

    // Redirect back to profile / verification page with success param
    return NextResponse.redirect(new URL('/verification?status=success&token=' + verificationResult.aadhaarTokenRef, req.url));
  } catch (err: any) {
    return NextResponse.redirect(new URL('/verification?status=error&msg=' + encodeURIComponent(err.message), req.url));
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, state, userId } = await req.json();
    const result = await exchangeDigiLockerCode(code || 'DL_TEST_CODE', state || '');
    const targetUserId = userId || 'user_client_demo';

    db.updateDigiLockerStatus(targetUserId, result.aadhaarTokenRef);
    return NextResponse.json({
      success: true,
      result,
      user: db.getUserById(targetUserId),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

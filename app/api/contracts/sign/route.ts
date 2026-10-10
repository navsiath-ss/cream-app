import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { contractId, role } = await req.json();

    if (!contractId || !role) {
      return NextResponse.json({ error: 'Missing contractId or role' }, { status: 400 });
    }

    const contract = db.getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const updates: any = {};
    const now = new Date().toISOString();

    if (role === 'client') {
      updates.client_signed = true;
      updates.client_signed_at = now;
    } else if (role === 'creator') {
      updates.creator_signed = true;
      updates.creator_signed_at = now;
    }

    // Check if both have signed
    const willBothBeSigned =
      (role === 'client' && contract.creator_signed) ||
      (role === 'creator' && contract.client_signed) ||
      (contract.client_signed && contract.creator_signed);

    if (willBothBeSigned) {
      updates.status = 'escrow_pending';
    }

    const updated = db.updateContract(contractId, updates);
    return NextResponse.json({ contract: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

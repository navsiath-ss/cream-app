import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { disburseEscrowPayout } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { contractId, clientSignature, feedbackRating } = await req.json();

    if (!contractId) {
      return NextResponse.json({ error: 'Missing contractId' }, { status: 400 });
    }

    const contract = db.getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const escrow = db.getEscrowByContractId(contractId);
    if (!escrow) {
      return NextResponse.json({ error: 'Escrow transaction not found' }, { status: 404 });
    }

    // Disburse Escrow Funds to Creator's Account
    const payoutResult = await disburseEscrowPayout({
      escrowId: escrow.id,
      amountInINR: escrow.amount,
      creatorBankRef: escrow.payout_bank_account || 'CREATOR_PRIMARY_VPA_BANK',
    });

    // Update Escrow State to Released
    db.updateEscrowTransaction(escrow.id, {
      status: 'released',
      released_at: new Date().toISOString(),
    });

    // Update Contract State to Completed
    const updatedContract = db.updateContract(contractId, {
      status: 'completed',
    });

    // Metadata Ingestion into Creator Profile (Doc 14 / REQ-5.2)
    const creatorProfile = db.getCreatorById(contract.creator_id);
    if (creatorProfile) {
      const dbInstance = (db as any).getDb();
      const cpIndex = dbInstance.creator_profiles.findIndex((cp: any) => cp.id === creatorProfile.id);
      if (cpIndex >= 0) {
        dbInstance.creator_profiles[cpIndex].completed_projects += 1;
        if (feedbackRating) {
          const oldRating = dbInstance.creator_profiles[cpIndex].rating;
          dbInstance.creator_profiles[cpIndex].rating = Number(((oldRating * 4 + feedbackRating) / 5).toFixed(2));
        }
        (db as any).saveDb(dbInstance);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'End-contract agreement signed. Escrow payout released to Creator bank account!',
      payoutResult,
      contract: updatedContract,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { disburseEscrowPayout } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { disputeId, action, creatorAmount, clientAmount, resolvedBy = 'Trust & Safety Council' } = await req.json();

    if (!disputeId || !action) {
      return NextResponse.json({ error: 'Missing disputeId or action' }, { status: 400 });
    }

    const dbInstance = (db as any).getDb();
    const dispute = dbInstance.dispute_cases.find((d: any) => d.id === disputeId);
    if (!dispute) {
      return NextResponse.json({ error: 'Dispute case not found' }, { status: 404 });
    }

    const contract = db.getContractById(dispute.contract_id);
    const escrow = db.getEscrowByContractId(dispute.contract_id);

    const settlement = {
      action,
      creator_amount: Number(creatorAmount) || 0,
      client_amount: Number(clientAmount) || 0,
      resolved_by: resolvedBy,
      timestamp: new Date().toISOString(),
    };

    // Update dispute
    db.updateDisputeCase(disputeId, {
      resolution_status: 'resolved',
      final_settlement: settlement,
      resolved_at: new Date().toISOString(),
    });

    // Update Escrow
    if (escrow) {
      if (action === 'creator_payout') {
        db.updateEscrowTransaction(escrow.id, {
          status: 'released',
          released_at: new Date().toISOString(),
        });
        await disburseEscrowPayout({
          escrowId: escrow.id,
          amountInINR: escrow.amount,
          creatorBankRef: 'CREATOR_PRIMARY_VPA_BANK',
        });
      } else if (action === 'client_refund') {
        db.updateEscrowTransaction(escrow.id, {
          status: 'refunded',
          released_at: new Date().toISOString(),
        });
      } else {
        db.updateEscrowTransaction(escrow.id, {
          status: 'partial_refund',
          released_at: new Date().toISOString(),
        });
      }
    }

    // Update contract status
    if (contract) {
      db.updateContract(contract.id, {
        status: action === 'client_refund' ? 'draft' : 'completed',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Dispute successfully resolved with action: ${action}`,
      settlement,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

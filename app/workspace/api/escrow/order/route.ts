import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createRazorpayEscrowOrder } from '@/lib/razorpay';
import { EscrowTransaction } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { contractId } = await req.json();

    if (!contractId) {
      return NextResponse.json({ error: 'Missing contractId' }, { status: 400 });
    }

    const contract = db.getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const amountInINR = contract.terms.agreed_amount;

    // Create official Razorpay Order
    const razorpayOrder = await createRazorpayEscrowOrder({
      amountInINR,
      contractId,
      clientId: contract.client_id,
      creatorId: contract.creator_id,
    });

    // Check if transaction already exists or create new
    let escrow = db.getEscrowByContractId(contractId);
    if (!escrow) {
      const newEscrow: EscrowTransaction = {
        id: `esc_${Date.now()}`,
        contract_id: contractId,
        client_id: contract.client_id,
        creator_id: contract.creator_id,
        amount: amountInINR,
        currency: 'INR',
        razorpay_order_id: razorpayOrder.id,
        status: 'created',
        created_at: new Date().toISOString(),
      };
      escrow = db.createEscrowTransaction(newEscrow);
    } else {
      escrow = db.updateEscrowTransaction(escrow.id, {
        razorpay_order_id: razorpayOrder.id,
        amount: amountInINR,
      })!;
    }

    return NextResponse.json({
      order: razorpayOrder,
      escrow,
      keyId: razorpayOrder.key_id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

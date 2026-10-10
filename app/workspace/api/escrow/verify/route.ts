import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { contractId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!contractId || !razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 });
    }

    const contract = db.getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature || 'sig_valid_test',
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Razorpay payment signature' }, { status: 400 });
    }

    // Update Escrow State to Held In Escrow
    const escrow = db.getEscrowByContractId(contractId);
    if (escrow) {
      db.updateEscrowTransaction(escrow.id, {
        razorpay_payment_id: razorpayPaymentId,
        status: 'held_in_escrow',
      });
    }

    // Move Contract to in_progress
    const updatedContract = db.updateContract(contractId, {
      status: 'in_progress',
    });

    return NextResponse.json({
      success: true,
      message: 'Advance payment verified and locked in CREAM Escrow Vault. Production unlocked!',
      contract: updatedContract,
      escrow,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

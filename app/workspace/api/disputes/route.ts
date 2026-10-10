import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyzeDisputeCase } from '@/lib/ai-witness';
import { DisputeCase } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contractId = searchParams.get('contractId');

  if (contractId) {
    const dispute = db.getDisputeByContractId(contractId);
    return NextResponse.json({ dispute });
  }

  const disputes = db.getDisputes();
  return NextResponse.json({ disputes });
}

export async function POST(req: NextRequest) {
  try {
    const { contractId, raisedBy, reason } = await req.json();

    if (!contractId || !reason) {
      return NextResponse.json({ error: 'Missing contractId or reason' }, { status: 400 });
    }

    const contract = db.getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const transcript = db.getMessagesByContract(contractId);
    const samples = db.getSamplesByContract(contractId);
    const lastSample = samples[0];

    // Hybrid AI Dispute Analysis (Doc 02 / REQ-5.1)
    const aiAnalysis = await analyzeDisputeCase({
      contract: contract.terms,
      transcript,
      sampleFeedback: lastSample?.client_feedback,
      reason,
    });

    const dispute: DisputeCase = {
      id: `dsp_${Date.now()}`,
      contract_id: contractId,
      raised_by: raisedBy || contract.client_id,
      reason,
      ai_analysis: aiAnalysis,
      resolution_status: 'ai_analyzed',
      created_at: new Date().toISOString(),
    };

    db.createDisputeCase(dispute);

    // Update contract status to disputed
    db.updateContract(contractId, { status: 'disputed' });

    return NextResponse.json({
      dispute,
      message: 'Dispute filed. AI Witness transcript analysis complete. Specialist intervention active.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

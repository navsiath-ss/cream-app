import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { sampleId, action, feedback } = await req.json();

    if (!sampleId || !action) {
      return NextResponse.json({ error: 'Missing sampleId or action' }, { status: 400 });
    }

    const dbInstance = (db as any).getDb();
    const sample = dbInstance.sample_renders.find((s: any) => s.id === sampleId);
    if (!sample) {
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }

    const contract = db.getContractById(sample.contract_id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    if (action === 'pre_approve') {
      // Weakly Defensible Rejection Boundary Established (ADR-05)
      db.updateSampleRender(sampleId, {
        status: 'pre_approved',
        client_feedback: feedback || 'Watermarked sample pre-approved for final master rendering.',
      });

      const updatedContract = db.updateContract(contract.id, {
        status: 'sample_approved',
      });

      return NextResponse.json({
        success: true,
        message: 'Sample successfully pre-approved! Production locked to approved preview parameters.',
        contract: updatedContract,
      });
    } else if (action === 'request_revision') {
      db.updateSampleRender(sampleId, {
        status: 'revision_requested',
        client_feedback: feedback || 'Specific revision adjustments requested.',
      });

      return NextResponse.json({
        success: true,
        message: 'Revision feedback sent to creator within contract revision allowance.',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

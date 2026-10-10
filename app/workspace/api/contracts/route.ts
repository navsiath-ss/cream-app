import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { VirtualContract } from '@/lib/types';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const contract = db.getContractById(id);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }
    const client = db.getUserById(contract.client_id);
    const creator = db.getUserById(contract.creator_id);
    const creatorProfile = db.getCreatorById(contract.creator_id);
    const samples = db.getSamplesByContract(id);
    const escrow = db.getEscrowByContractId(id);

    return NextResponse.json({
      contract,
      client,
      creator,
      creatorProfile,
      samples,
      escrow,
    });
  }

  const contracts = db.getContracts();
  return NextResponse.json({ contracts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { briefId, clientId, creatorId, terms } = body;

    if (!clientId || !creatorId || !terms) {
      return NextResponse.json({ error: 'Missing required contract parameters' }, { status: 400 });
    }

    const contractId = `cnt_${Date.now()}`;
    const termsString = JSON.stringify(terms);
    const checksum = crypto.createHash('sha256').update(`${contractId}:${termsString}:${clientId}:${creatorId}`).digest('hex');

    const newContract: VirtualContract = {
      id: contractId,
      brief_id: briefId || '',
      client_id: clientId,
      creator_id: creatorId,
      terms,
      client_signed: false,
      creator_signed: false,
      contract_checksum: checksum,
      status: 'awaiting_signatures',
      created_at: new Date().toISOString(),
    };

    const saved = db.createContract(newContract);
    return NextResponse.json({ contract: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

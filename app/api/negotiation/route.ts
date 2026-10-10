import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { witnessNegotiationMessage } from '@/lib/ai-witness';
import { NegotiationMessage } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contractId = searchParams.get('contractId');

  if (!contractId) {
    return NextResponse.json({ error: 'Missing contractId' }, { status: 400 });
  }

  const messages = db.getMessagesByContract(contractId);
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, senderId, senderRole, message, briefId } = body;

    if (!contractId || !message) {
      return NextResponse.json({ error: 'Missing contractId or message' }, { status: 400 });
    }

    const newMessage: NegotiationMessage = {
      id: `msg_${Date.now()}`,
      contract_id: contractId,
      brief_id: briefId,
      sender_id: senderId,
      sender_role: senderRole,
      message,
      is_ai_witness: false,
      created_at: new Date().toISOString(),
    };

    // Save user message
    db.addNegotiationMessage(newMessage);

    const history = db.getMessagesByContract(contractId);

    // Live AI Witness evaluation
    const { witnessNote, autoDraftTerms } = await witnessNegotiationMessage(history, newMessage);

    let aiMessage: NegotiationMessage | undefined = undefined;
    if (witnessNote) {
      aiMessage = {
        id: `msg_ai_${Date.now()}`,
        contract_id: contractId,
        brief_id: briefId,
        sender_id: 'ai_witness_agent',
        sender_role: 'ai_witness',
        message: witnessNote,
        is_ai_witness: true,
        ai_witness_note: witnessNote,
        created_at: new Date().toISOString(),
      };
      db.addNegotiationMessage(aiMessage);
    }

    return NextResponse.json({
      savedMessage: newMessage,
      aiWitnessMessage: aiMessage,
      autoDraftTerms,
      allMessages: db.getMessagesByContract(contractId),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

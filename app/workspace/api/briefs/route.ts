import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processBriefConversation } from '@/lib/ai-witness';
import { BriefStructured } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const briefId = searchParams.get('id');

  if (briefId) {
    const brief = db.getBriefById(briefId);
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
    }
    return NextResponse.json({ brief });
  }

  const briefs = db.getBriefs();
  return NextResponse.json({ briefs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history = [], userMessage, clientId = 'user_client_demo', finalizeBrief } = body;

    // Direct brief creation if already structured
    if (finalizeBrief && body.briefData) {
      const briefId = `brief_${Date.now()}`;
      const newBrief: BriefStructured = {
        id: briefId,
        client_id: clientId,
        title: body.briefData.title || 'Generative AI Campaign Brief',
        content_type: body.briefData.content_type || 'video',
        aspect_ratio: body.briefData.aspect_ratio || '16:9',
        camera_angles: body.briefData.camera_angles || ['Cinematic Wide Angle', 'Macro Focus'],
        style_benchmarks: body.briefData.style_benchmarks || ['Photorealistic High-End'],
        model_preferences: body.briefData.model_preferences || ['Runway Gen-2', 'Midjourney v6'],
        commercial_rights: body.briefData.commercial_rights || 'digital_ad',
        budget_min: Number(body.briefData.budget_min) || 40000,
        budget_max: Number(body.briefData.budget_max) || 80000,
        deadline_days: Number(body.briefData.deadline_days) || 7,
        key_elements: body.briefData.key_elements || '',
        raw_transcript: history,
        status: 'published',
        created_at: new Date().toISOString(),
      };

      const saved = db.createBrief(newBrief);
      return NextResponse.json({ brief: saved, message: 'Brief successfully published!' });
    }

    if (!userMessage) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Conversational Brief Builder extraction step
    const result = await processBriefConversation(history, userMessage);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

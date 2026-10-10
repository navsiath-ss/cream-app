import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const tool = searchParams.get('tool') || '';
  const specialization = searchParams.get('specialization') || '';
  const maxBudget = searchParams.get('maxBudget') ? Number(searchParams.get('maxBudget')) : undefined;
  const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;

  // ADR-03: Deterministic matching decoupled from LLM direct DB querying
  const { creators, matchScoreMap } = db.searchCreators({
    query: q,
    tool,
    specialization,
    maxBudget,
    minRating,
  });

  return NextResponse.json({
    total: creators.length,
    creators,
    matchScores: matchScoreMap,
    queryApplied: { q, tool, specialization, maxBudget, minRating },
  });
}

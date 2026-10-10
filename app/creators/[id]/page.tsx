'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Star,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Cpu,
  Film,
  CheckCircle2,
  Clock,
  Eye,
  FileCode,
} from 'lucide-react';
import { CreatorProfile, User } from '@/lib/types';

function CreatorDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const briefId = searchParams.get('briefId') || '';

  const creatorId = params.id as string;
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [creatorUser, setCreatorUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStartingNegotiation, setIsStartingNegotiation] = useState(false);

  useEffect(() => {
    fetch(`/api/creators/${creatorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.creator) {
          setCreator(data.creator);
          setCreatorUser(data.user);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [creatorId]);

  const handleStartContractNegotiation = async () => {
    setIsStartingNegotiation(true);
    try {
      const clientId = localStorage.getItem('cream_user_id') || 'user_client_demo';

      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefId: briefId || `brief_${Date.now()}`,
          clientId,
          creatorId: creator?.user_id || 'user_creator_arjun',
          terms: {
            deliverables: [
              '1x 30s Master AI Video Commercial (4K)',
              '3x High-Resolution Keyframe Stills',
              'SynthID Steganographic Provenance File',
            ],
            resolution: '4K (3840x2160 UHD)',
            aspect_ratio: '16:9 Landscape',
            max_revisions: 2,
            deadline: '7 Days from Escrow Confirmation',
            licensing_rights: 'Perpetual Commercial Digital Advertising Rights',
            agreed_amount: creator?.min_project_budget || 55000,
            escrow_milestones: [
              { name: 'Upfront Escrow Deposit (Locked in CREAM Vault)', percent: 100 },
              { name: 'Watermarked Sample Pre-Approval Gate', percent: 0 },
              { name: 'Pristine Deliverable Sign-Off & Escrow Release', percent: 100 },
            ],
          },
        }),
      });

      const data = await res.json();
      if (data.contract) {
        // Send initial message to start live AI witness negotiation
        await fetch('/api/negotiation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contractId: data.contract.id,
            briefId: data.contract.brief_id,
            senderId: clientId,
            senderRole: 'client',
            message: `Hello ${creator?.display_name}! We reviewed your AI portfolio and would like to engage you for our commercial project.`,
          }),
        });

        router.push(`/workspace/${data.contract.id}`);
      }
    } catch (e) {
      console.error(e);
      setIsStartingNegotiation(false);
    }
  };

  if (loading || !creator) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">
        Loading verified creator profile...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
      {/* Profile Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-zinc-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={creatorUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={creator.display_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white">{creator.display_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> DigiLocker KYC Verified
                </span>
              </div>
              <p className="text-sm font-medium text-amber-300">{creator.tagline}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1 text-zinc-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <strong>{creator.rating.toFixed(2)}</strong> / 5.0
                </span>
                <span>•</span>
                <span>{creator.completed_projects} Projects Delivered</span>
                <span>•</span>
                <span>₹{creator.hourly_rate.toLocaleString()}/hr</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartContractNegotiation}
              disabled={isStartingNegotiation}
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{isStartingNegotiation ? 'Initializing Contract...' : 'Connect & Draft Virtual Contract'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-zinc-800/80">
          {creator.verified_badges.map((b) => (
            <span
              key={b}
              className="px-3 py-1 rounded-lg text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Bio & Production Stack Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" /> Generative Production Stack
          </h2>
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-2">Mastered Models & APIs</span>
            <div className="flex flex-wrap gap-1.5">
              {creator.tools.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-amber-300 font-mono text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-2">Specialized Workflows & LoRAs</span>
            <div className="flex flex-wrap gap-1.5">
              {creator.workflows.map((w) => (
                <span key={w} className="px-2.5 py-1 rounded bg-zinc-900 border border-indigo-900/40 text-indigo-300 text-xs">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">About Creator</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">{creator.bio}</p>
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 text-xs text-zinc-400 space-y-2">
            <span className="font-bold text-zinc-200 block">CREAM Escrow & IP Terms:</span>
            <p>
              All projects with this creator operate under hard-gated virtual contracts. Sample previews are protected via dual-layer SynthID watermarking. Advance payments are held in audited escrow until your pre-approval.
            </p>
          </div>
        </div>
      </div>

      {/* AI Portfolio Renders Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Verified AI Portfolio Renders</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Authenticated generative video samples with prompt snippets and node workflows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creator.portfolio_items.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/30 transition-all space-y-4 p-5"
            >
              <div className="relative h-64 w-full rounded-xl overflow-hidden bg-zinc-950">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Authenticated Render
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">{item.workflow_description}</p>

                {item.prompt_snippet && (
                  <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-900 font-mono text-[11px] text-zinc-400">
                    <span className="text-[10px] uppercase text-zinc-600 block mb-1">Prompt / Synthesis Technique:</span>
                    <span className="text-amber-300/90">&ldquo;{item.prompt_snippet}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CreatorDetailPage() {
  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">Loading creator details...</div>}>
      <CreatorDetailContent />
    </React.Suspense>
  );
}

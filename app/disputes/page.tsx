'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
  Bot,
  User,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import { DisputeCase } from '@/lib/types';

export default function DisputeConsolePage() {
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);
  const [resolving, setResolving] = useState(false);

  const fetchDisputes = () => {
    fetch('/api/disputes')
      .then((res) => res.json())
      .then((data) => {
        setDisputes(data.disputes || []);
        if (data.disputes && data.disputes.length > 0) {
          setSelectedDispute(data.disputes[0]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolveDispute = async (action: 'creator_payout' | 'client_refund' | 'split') => {
    if (!selectedDispute) return;
    setResolving(true);
    try {
      const split = selectedDispute.ai_analysis?.suggested_split || { creator_percent: 50, client_percent: 50 };
      const total = 55000;
      const creatorAmount = action === 'creator_payout' ? total : action === 'split' ? (total * split.creator_percent) / 100 : 0;
      const clientAmount = action === 'client_refund' ? total : action === 'split' ? (total * split.client_percent) / 100 : 0;

      const res = await fetch('/api/disputes/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disputeId: selectedDispute.id,
          action,
          creatorAmount,
          clientAmount,
          resolvedBy: 'Trust & Safety Human Specialist',
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchDisputes();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
          <Scale className="w-4 h-4" /> Feature F-07: Hybrid AI + Human Dispute Resolution Console
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          Trust & Safety Dispute Council
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Combines automated AI Witness transcript auditing with human specialist final review to execute objective escrow settlements.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading dispute cases...</div>
      ) : disputes.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-zinc-800 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Zero Active Disputes</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            All active project workspaces are currently operating smoothly under standard contract and preview milestones.
          </p>
          <div className="pt-2">
            <Link
              href="/workspace"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
            >
              View Active Workspaces
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dispute Cases Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
              Dispute Queue ({disputes.length})
            </span>
            {disputes.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDispute(d)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedDispute?.id === d.id
                    ? 'glass-panel-gold border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'glass-panel border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">#{d.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    d.resolution_status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {d.resolution_status.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{d.reason}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                  Contract #{d.contract_id.slice(-8)}
                </p>
              </button>
            ))}
          </div>

          {/* Selected Dispute Review Console */}
          {selectedDispute && (
            <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Active Case</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedDispute.reason}</h3>
                  <span className="text-xs text-zinc-400 font-mono">Contract ID: {selectedDispute.contract_id}</span>
                </div>
                <Link
                  href={`/workspace/${selectedDispute.contract_id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* AI Witness Case Analysis Breakdown */}
              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Bot className="w-4 h-4" /> AI Witness Transcript & Compliance Audit
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">Sample Compliance Score</span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                      {selectedDispute.ai_analysis?.sample_compliance_score}%
                    </span>
                    <span className="block text-[10px] text-zinc-400 mt-0.5">Based on ADR-05 weakly defensible audit</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-[10px] uppercase font-mono text-zinc-500 block">AI Recommended Escrow Split</span>
                    <span className="text-base font-bold text-white font-mono">
                      {selectedDispute.ai_analysis?.suggested_split.creator_percent}% Creator / {selectedDispute.ai_analysis?.suggested_split.client_percent}% Client
                    </span>
                    <span className="block text-[10px] text-zinc-400 mt-0.5">Objective compromise calculation</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Audit Findings</span>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                    {selectedDispute.ai_analysis?.recommendation}
                  </p>
                </div>
              </div>

              {/* Human Specialist Settlement Actions */}
              {selectedDispute.resolution_status !== 'resolved' ? (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Execute Specialist Resolution:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleResolveDispute('creator_payout')}
                      disabled={resolving}
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                    >
                      Release 100% Escrow to Creator
                    </button>
                    <button
                      onClick={() => handleResolveDispute('split')}
                      disabled={resolving}
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
                    >
                      Execute Suggested Split (ADR-05)
                    </button>
                    <button
                      onClick={() => handleResolveDispute('client_refund')}
                      disabled={resolving}
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors"
                    >
                      Full Escrow Refund to Client
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dispute Resolved by Trust & Safety Specialist</span>
                  </div>
                  <p className="text-zinc-300">
                    Action executed: <strong className="text-white">{selectedDispute.final_settlement?.action.toUpperCase()}</strong>. Escrow ledger updated.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

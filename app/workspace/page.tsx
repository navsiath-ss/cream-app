'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  FileCheck,
  CreditCard,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { VirtualContract } from '@/lib/types';

export default function WorkspaceIndexPage() {
  const [contracts, setContracts] = useState<VirtualContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contracts')
      .then((res) => res.json())
      .then((data) => {
        setContracts(data.contracts || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'awaiting_signatures':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">Awaiting Signatures</span>;
      case 'escrow_pending':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">Escrow Deposit Required</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Production in Progress</span>;
      case 'sample_review':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">Sample Review Gate</span>;
      case 'sample_approved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">Sample Pre-Approved</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Completed & Escrow Released</span>;
      case 'disputed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">Under Dispute Council</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Cpu className="w-4 h-4" /> Feature F-05 & F-06: Workspaces & Virtual Contracts
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Active Client & Creator Workspaces</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Hard-gated contract workspaces orchestrating negotiations, Razorpay escrow deposits, and dual-watermarked sample reviews.
          </p>
        </div>

        <Link
          href="/brief"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Brief</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading active workspaces...</div>
      ) : contracts.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-zinc-800 space-y-4">
          <p className="text-sm font-semibold text-zinc-300">No active project workspaces yet</p>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Design an AI brief or visit a creator profile to draft a legally binding virtual contract.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/brief"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400"
            >
              Start AI Brief Builder
            </Link>
            <Link
              href="/creators"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Explore Creators
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="glass-panel p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">#{contract.id}</span>
                  {getStatusBadge(contract.status)}
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">
                  {contract.terms.deliverables[0] || 'AI Production Contract'}
                </h3>

                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Agreed Escrow Amount:</span>
                    <span className="font-mono text-white font-bold">₹{contract.terms.agreed_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revisions Allowed:</span>
                    <span className="font-mono text-zinc-300">{contract.terms.max_revisions} Rounds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Timeline:</span>
                    <span className="font-mono text-zinc-300">{contract.terms.deadline}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-850 font-mono text-[10px] text-zinc-500 truncate">
                  SHA256: {contract.contract_checksum?.slice(0, 24)}...
                </div>
              </div>

              <Link
                href={`/workspace/${contract.id}`}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-amber-500 hover:text-black border border-zinc-700 text-zinc-200 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

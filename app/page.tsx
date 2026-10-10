import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Eye,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { db } from '@/lib/db';

export default function HomePage() {
  const creators = db.getCreators();

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top announcement pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-mono">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>CREAM v1.0 — Offloading Liabilities, Protecting Generative IP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Filter to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">Cream Layer</span> of Generative AI Creators
          </h1>

          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover elite AI cinematographers, animators, and LoRA engineers. Hard-gated by <strong className="text-zinc-200">DigiLocker KYC</strong>, <strong className="text-zinc-200">Razorpay Escrow Vaults</strong>, and <strong className="text-zinc-200">SynthID Dual Watermarks</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/brief"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              Build Brief with AI Assistant
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/creators"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-all hover:scale-[1.02]"
            >
              Explore Creator Directory
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            <div className="glass-panel p-5 rounded-2xl text-left border border-zinc-800">
              <span className="text-2xl font-bold text-amber-400 font-mono">100%</span>
              <p className="text-xs text-zinc-400 mt-1">Escrow Backed via Razorpay</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-left border border-zinc-800">
              <span className="text-2xl font-bold text-emerald-400 font-mono">0 Storage</span>
              <p className="text-xs text-zinc-400 mt-1">Zero-Storage DigiLocker KYC</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-left border border-zinc-800">
              <span className="text-2xl font-bold text-sky-400 font-mono">SynthID</span>
              <p className="text-xs text-zinc-400 mt-1">Steganographic Watermarking</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-left border border-zinc-800">
              <span className="text-2xl font-bold text-purple-400 font-mono">Live AI</span>
              <p className="text-xs text-zinc-400 mt-1">Witness & Contract Gatekeeper</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Foundational Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Architectural Decisions</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How CREAM Solves Platform Trust & IP Piracy
          </h2>
          <p className="text-sm text-zinc-400">
            Based on the CREAM ADRs (01 to 05), we delegate core liabilities to tier-1 infrastructure while enforcing strict virtual contract gates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Upfront Escrow Vault</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Clients deposit project funds in advance into an audited Razorpay escrow vault. Creators never risk unpaid work, and clients retain full protection against non-delivery.
            </p>
            <div className="text-[11px] font-mono text-amber-300/80 flex items-center gap-1.5 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> ADR-04: Upfront Gateway Escrow
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero-Storage DigiLocker KYC</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All creators and clients complete Indian government identity verification via DigiLocker. CREAM stores zero Aadhaar or PAN files—only cryptographic tokens.
            </p>
            <div className="text-[11px] font-mono text-sky-300/80 flex items-center gap-1.5 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> ADR-02: Zero-Storage Gov Verification
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Dual Watermark & Weak Rejections</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Preview samples embed visible branding and imperceptible SynthID steganography. Pre-approved samples make subsequent arbitrary rejections weakly defensible.
            </p>
            <div className="text-[11px] font-mono text-emerald-300/80 flex items-center gap-1.5 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> ADR-05: Steganographic Protection
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Verified Talent</span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
              Top-Tier Generative AI Talent
            </h2>
          </div>
          <Link
            href="/creators"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            View all verified creators <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creators.slice(0, 3).map((creator) => (
            <div
              key={creator.id}
              className="glass-panel rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={creator.portfolio_items[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
                    alt={creator.display_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      ★ {creator.rating.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/70 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> DigiLocker
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{creator.display_name}</h3>
                    <p className="text-xs text-amber-400/90 font-medium line-clamp-1">{creator.tagline}</p>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{creator.bio}</p>

                  {/* Tool chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {creator.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded text-[10px] bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-zinc-800/60 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">Min Budget</span>
                  <p className="text-xs font-bold text-white font-mono">₹{creator.min_project_budget.toLocaleString()}</p>
                </div>
                <Link
                  href={`/creators/${creator.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                >
                  View Portfolio
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

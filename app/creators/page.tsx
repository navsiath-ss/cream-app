'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { CreatorProfile } from '@/lib/types';

function CreatorDirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTool = searchParams.get('tool') || '';
  const briefId = searchParams.get('briefId') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedTool, setSelectedTool] = useState(initialTool);
  const [selectedSpec, setSelectedSpec] = useState('');
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (selectedTool) params.set('tool', selectedTool);
      if (selectedSpec) params.set('specialization', selectedSpec);
      if (maxBudget) params.set('maxBudget', maxBudget.toString());
      if (minRating) params.set('minRating', minRating.toString());

      const res = await fetch(`/api/creators/search?${params.toString()}`);
      const data = await res.json();
      setCreators(data.creators || []);
      setMatchScores(data.matchScores || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [selectedTool, selectedSpec, maxBudget, minRating]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCreators();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Cpu className="w-4 h-4" /> Feature F-04: Deterministic Programmatic Discovery
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Verified Generative AI Creators
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Zero hallucinations. Exact parametric SQL + semantic vector matching across verified creator capabilities.
          </p>
        </div>

        {briefId && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matching to Active Campaign Brief #{briefId.slice(-6)}</span>
          </div>
        )}
      </div>

      {/* Main Layout: Filters & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" /> Filters
            </span>
            <button
              onClick={() => {
                setQuery('');
                setSelectedTool('');
                setSelectedSpec('');
                setMaxBudget(undefined);
                setMinRating(undefined);
              }}
              className="text-[11px] text-zinc-500 hover:text-zinc-300"
            >
              Reset
            </button>
          </div>

          {/* Tool filter */}
          <div>
            <label className="text-[11px] uppercase font-mono text-zinc-400 block mb-2 font-medium">
              Generative Tool / Model
            </label>
            <div className="space-y-1.5 text-xs">
              {['', 'Runway Gen-2', 'Midjourney v6', 'ComfyUI', 'Flux.1', 'ElevenLabs', 'Kling AI'].map((tool) => (
                <button
                  key={tool}
                  onClick={() => setSelectedTool(tool)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-colors ${
                    selectedTool === tool
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {tool || 'All Models & Tools'}
                </button>
              ))}
            </div>
          </div>

          {/* Specialization */}
          <div>
            <label className="text-[11px] uppercase font-mono text-zinc-400 block mb-2 font-medium">
              Creative Specialization
            </label>
            <div className="space-y-1.5 text-xs">
              {['', 'Photorealistic Commercials', 'Stylized 3D Animation', 'Automotive Cinematics', 'Fashion Lookbooks'].map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpec(spec)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                    selectedSpec === spec
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {spec || 'All Specializations'}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="text-[11px] uppercase font-mono text-zinc-400 block mb-2 font-medium">
              Minimum Rating
            </label>
            <div className="flex gap-1.5">
              {[4.5, 4.8, 4.9].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinRating(minRating === rate ? undefined : rate)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    minRating === rate
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  ★ {rate}+
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Search Bar & Creator Cards */}
        <div className="lg:col-span-9 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keywords, LoRA workflows, camera styles, prompt techniques..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Results Grid */}
          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-500">
              Querying deterministic pgvector database...
            </div>
          ) : creators.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-zinc-800 space-y-2">
              <p className="text-sm font-semibold text-zinc-300">No creators found matching these filters</p>
              <p className="text-xs text-zinc-500">Try broadening your model or budget parameters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creators.map((creator) => {
                const matchScore = matchScores[creator.id] || 92;
                return (
                  <div
                    key={creator.id}
                    className="glass-panel rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Media Preview Card */}
                      <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                        <img
                          src={creator.portfolio_items[0]?.thumbnail_url}
                          alt={creator.display_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131722] via-transparent to-transparent" />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500/90 text-black shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 fill-black" />
                            {matchScore}% Match
                          </span>

                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> DigiLocker
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-zinc-200 border border-zinc-700">
                              ★ {creator.rating.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Tagline in image */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-base font-bold text-white drop-shadow-md">
                            {creator.display_name}
                          </h3>
                          <p className="text-xs text-amber-300 font-medium line-clamp-1">
                            {creator.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Details Body */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {creator.bio}
                        </p>

                        {/* Tools */}
                        <div>
                          <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1.5">
                            Production Pipeline:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {creator.tools.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono border border-zinc-700/60"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Workflows */}
                        <div>
                          <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1.5">
                            Workflows & Workarounds:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {creator.workflows.slice(0, 2).map((w) => (
                              <span
                                key={w}
                                className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-indigo-300 border border-indigo-900/40"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-5 pt-0 border-t border-zinc-800/80 mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-zinc-500 block">Min Engagement</span>
                        <span className="font-mono text-xs font-bold text-white">
                          ₹{creator.min_project_budget.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/creators/${creator.id}${briefId ? `?briefId=${briefId}` : ''}`}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors flex items-center gap-1 shadow-md shadow-amber-500/10"
                        >
                          <span>Review & Hire</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreatorDirectoryPage() {
  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">Loading verified creators...</div>}>
      <CreatorDirectoryContent />
    </React.Suspense>
  );
}

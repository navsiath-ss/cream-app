'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Send,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Bot,
  User,
  Zap,
  Film,
  Camera,
  Layers,
  FileCheck,
} from 'lucide-react';
import { BriefStructured } from '@/lib/types';

interface Message {
  role: 'client' | 'assistant';
  text: string;
  timestamp: string;
}

export default function BriefBuilderPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hello! I am your CREAM AI Brief Builder. Describe the generative AI campaign or creative asset you need (e.g., 'A 30-second photorealistic commercial for a luxury watch brand with rain and neon lighting, 16:9, using Runway Gen-2 and Midjourney'). I will extract the exact production parameters and prepare a structured brief for creators.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedBrief, setExtractedBrief] = useState<Partial<BriefStructured>>({
    title: 'Generative AI Campaign Brief',
    content_type: 'video',
    aspect_ratio: '16:9',
    camera_angles: ['Cinematic Steadicam Tracking'],
    style_benchmarks: ['High-End Luxury Photorealism'],
    model_preferences: ['Runway Gen-2', 'Midjourney v6'],
    commercial_rights: 'digital_ad',
    budget_min: 45000,
    budget_max: 85000,
    deadline_days: 7,
    key_elements: 'Photorealistic commercial with temporal consistency',
  });
  const [isComplete, setIsComplete] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const userMsg: Message = {
      role: 'client',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newHistory,
          userMessage: userText,
          clientId: localStorage.getItem('cream_user_id') || 'user_client_demo',
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }

      if (data.extractedBrief) {
        setExtractedBrief((prev) => ({ ...prev, ...data.extractedBrief }));
      }

      if (data.isComplete) {
        setIsComplete(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishAndSearch = async () => {
    setIsPublishing(true);
    try {
      const clientId = localStorage.getItem('cream_user_id') || 'user_client_demo';
      const res = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalizeBrief: true,
          briefData: extractedBrief,
          clientId,
          history: messages,
        }),
      });

      const data = await res.json();
      if (data.brief) {
        // Redirect to creator directory with extracted parameters pre-filtered!
        const toolParam = extractedBrief.model_preferences?.[0] || '';
        router.push(`/creators?q=${encodeURIComponent(extractedBrief.title || '')}&tool=${encodeURIComponent(toolParam)}&briefId=${data.brief.id}`);
      }
    } catch (err) {
      console.error('Error publishing brief:', err);
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Feature F-01: AI-Assisted Brief Builder
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Design Your Generative Campaign Brief</h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Chat naturally with the CREAM Brief Assistant. We extract technical generative parameters without requiring you to know prompt engineering syntax.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chat Window */}
        <div className="lg:col-span-7 glass-panel rounded-2xl border border-zinc-800 flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white">CREAM Conversational AI</span>
                <span className="block text-[10px] text-zinc-400">Prompt & Parameter Extraction Engine</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
              Lossless Context Mode
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === 'client'
                      ? 'bg-amber-500 text-black font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.role === 'client' ? 'text-black/60' : 'text-zinc-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.role === 'client' && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 items-center text-xs text-zinc-500 animate-pulse">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span>Analyzing requirement parameters...</span>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="p-2 px-4 bg-zinc-950/20 border-t border-zinc-900 flex gap-2 overflow-x-auto text-[11px] text-zinc-400">
            <button
              onClick={() => {
                setInput('Need a 30s photorealistic video of an electric sports car, Tokyo neon rain, Runway Gen-2, budget 60,000 INR');
              }}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 whitespace-nowrap text-zinc-300"
            >
              + Tokyo Neon Sports Car (Runway Gen-2)
            </button>
            <button
              onClick={() => {
                setInput('Creating high-fashion luxury jewelry stills with macro lens, Midjourney v6 and Flux.1, 9:16 aspect ratio');
              }}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 whitespace-nowrap text-zinc-300"
            >
              + Luxury Haute Couture (Midjourney + Flux)
            </button>
          </div>

          {/* Input box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell the assistant what you want to create..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right: Live Structured JSON Brief Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Structured Brief Output
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                JSON Schema Validated
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={extractedBrief.title || ''}
                  onChange={(e) => setExtractedBrief({ ...extractedBrief, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Format Type</label>
                  <select
                    value={extractedBrief.content_type}
                    onChange={(e: any) => setExtractedBrief({ ...extractedBrief, content_type: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                  >
                    <option value="video">Video (Motion)</option>
                    <option value="still_graphic">Still Graphic</option>
                    <option value="animation">Stylized Animation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Aspect Ratio</label>
                  <select
                    value={extractedBrief.aspect_ratio}
                    onChange={(e: any) => setExtractedBrief({ ...extractedBrief, aspect_ratio: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                  >
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Vertical (Reels/Shorts)</option>
                    <option value="1:1">1:1 Square</option>
                    <option value="4:5">4:5 Social Portrait</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Target Generative Models</label>
                <div className="flex flex-wrap gap-1.5">
                  {extractedBrief.model_preferences?.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-300 font-mono text-[10px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Style Benchmarks</label>
                <div className="flex flex-wrap gap-1.5">
                  {extractedBrief.style_benchmarks?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Budget Range (INR)</label>
                  <div className="font-mono text-white text-xs bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    ₹{extractedBrief.budget_min?.toLocaleString()} - ₹{extractedBrief.budget_max?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Turnaround</label>
                  <div className="font-mono text-white text-xs bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    {extractedBrief.deadline_days} Days
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Commercial Usage Rights</label>
                <div className="font-mono text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2 rounded-lg">
                  Perpetual Commercial Digital Ad Rights
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={handlePublishAndSearch}
              disabled={isPublishing}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>{isPublishing ? 'Publishing Brief...' : 'Search Matching Creators (ADR-03)'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-[11px] text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-300">ADR-03 Architectural Safeguard:</p>
            <p>
              Your conversational transcript is structured and passed to deterministic database indexes. LLMs never directly execute SQL or mutate database state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

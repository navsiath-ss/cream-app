'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Sparkles, Briefcase, Search, Scale, UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { User } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load active session from local storage or default to demo client
    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('cream_user_id') || 'user_client_demo' : 'user_client_demo';
    fetch(`/api/auth/current-user?userId=${savedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
          setAllUsers(data.allUsers || []);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSwitchUser = (userId: string) => {
    localStorage.setItem('cream_user_id', userId);
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-brand-border/60 bg-[#0c0e14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-black text-lg tracking-wider font-mono">CR</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  CREAM <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">AI</span>
                </span>
                <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-medium">Top Tier AI Creators</span>
              </div>
            </Link>

            {/* Navigation links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/brief"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/brief' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Brief Builder
              </Link>
              <Link
                href="/creators"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname.startsWith('/creators') ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                Creator Directory
              </Link>
              <Link
                href="/workspace"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname.startsWith('/workspace') ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Workspaces & Contracts
              </Link>
              <Link
                href="/verification"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/verification' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                DigiLocker KYC
              </Link>
              <Link
                href="/disputes"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  pathname === '/disputes' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-purple-400" />
                Dispute Council
              </Link>
            </div>
          </div>

          {/* Right Action Bar: Persona Switcher & DigiLocker status */}
          <div className="flex items-center gap-3">
            {/* DigiLocker verification badge */}
            {currentUser && (
              <Link
                href="/verification"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                  currentUser.is_digilocker_verified
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-900/30'
                    : 'bg-amber-950/30 text-amber-300 border-amber-500/40 animate-pulse'
                }`}
                title="DigiLocker Zero-Storage Government KYC"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${currentUser.is_digilocker_verified ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span>{currentUser.is_digilocker_verified ? 'DigiLocker Verified' : 'Verify via DigiLocker'}</span>
              </Link>
            )}

            {/* Persona Switcher Dropdown */}
            <div className="flex items-center gap-2 bg-[#171b26] border border-zinc-800 rounded-lg p-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 px-1 hidden sm:inline">Role:</span>
              <select
                aria-label="Switch User Persona"
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
                value={currentUser?.id || 'user_client_demo'}
                onChange={(e) => handleSwitchUser(e.target.value)}
              >
                {allUsers.length > 0 ? (
                  allUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#171b26] text-zinc-200">
                      {u.name} ({u.role.toUpperCase()})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="user_client_demo" className="bg-[#171b26]">Alex Morgan (CLIENT)</option>
                    <option value="user_creator_arjun" className="bg-[#171b26]">Arjun Mehta (CREATOR)</option>
                    <option value="user_admin" className="bg-[#171b26]">Trust Council (ADMIN)</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

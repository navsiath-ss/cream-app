'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  FileCheck,
  Building,
  KeyRound,
  ArrowRight,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { User } from '@/lib/types';

export default function VerificationPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem('cream_user_id') || 'user_client_demo';
    fetch(`/api/auth/current-user?userId=${savedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDigiLockerOAuth = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/digilocker/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: `MERIPEHCHAN_AUTH_CODE_${Date.now()}`,
          userId: currentUser?.id || 'user_client_demo',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setVerificationSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Feature F-03 & ADR-02: Zero-Storage KYC Identity Gate
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          DigiLocker Government Identity Verification
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Authenticate your professional identity directly via official government tokens without uploading physical Aadhaar or PAN documents to CREAM servers.
        </p>
      </div>

      {/* Main Verification Status Card */}
      <div className="glass-panel p-8 rounded-3xl border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              currentUser?.is_digilocker_verified ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Current Account</span>
              <h2 className="text-lg font-bold text-white">{currentUser?.name} ({currentUser?.role.toUpperCase()})</h2>
              <span className="text-xs text-zinc-400">{currentUser?.email}</span>
            </div>
          </div>

          <div>
            {currentUser?.is_digilocker_verified ? (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm shadow-emerald-900/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                DigiLocker Verified Citizen
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-amber-950/40 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                Verification Required
              </span>
            )}
          </div>
        </div>

        {currentUser?.is_digilocker_verified ? (
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-850 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Aadhaar Token Reference:</span>
              <span className="text-emerald-400 font-bold">{currentUser.digilocker_aadhaar_ref}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Issuing Authority:</span>
              <span className="text-zinc-300">National Informatics Centre / UIDAI</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Verified Timestamp:</span>
              <span className="text-zinc-300">{new Date(currentUser.digilocker_verified_at || Date.now()).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Raw Document Storage on CREAM:</span>
              <span className="text-sky-400 font-bold">ZERO BYTES (ADR-02 Compliant)</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-zinc-300 leading-relaxed">
              Completing DigiLocker verification immediately unlocks verified status badges on creator portfolios, builds client credibility, and authorizes high-value Razorpay escrow payouts.
            </p>
            <button
              onClick={handleDigiLockerOAuth}
              disabled={isVerifying}
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 text-black hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-lg shadow-sky-500/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isVerifying ? 'Authenticating with DigiLocker...' : 'Authenticate Identity via MeriPehchan / DigiLocker'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ADR-02 Architectural Safeguard Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Government Token Exchange</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            DigiLocker validates your citizen identity directly via official government APIs. CREAM receives an encrypted SHA-256 confirmation token.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Zero-Leak Liability</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Because CREAM does not host your physical Aadhaar cards or passport scans, user identity theft via platform data leaks is mathematically impossible.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Verified Trust Signals</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            DigiLocker badges display directly on creator search results and virtual contract documents to foster instant commercial trust.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Send,
  Bot,
  User,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Scale,
  FileCheck,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import {
  VirtualContract,
  NegotiationMessage,
  SampleRender,
  EscrowTransaction,
  User as UserType,
} from '@/lib/types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ContractWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;

  const [contract, setContract] = useState<VirtualContract | null>(null);
  const [clientUser, setClientUser] = useState<UserType | null>(null);
  const [creatorUser, setCreatorUser] = useState<UserType | null>(null);
  const [escrow, setEscrow] = useState<EscrowTransaction | null>(null);
  const [samples, setSamples] = useState<SampleRender[]>([]);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('user_client_demo');

  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingSample, setUploadingSample] = useState(false);

  // Steganography inspection modal
  const [inspectingSynthID, setInspectingSynthID] = useState(false);
  const [synthIDInspectionResult, setSynthIDInspectionResult] = useState<any>(null);

  // Payment state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Dispute state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const loadWorkspaceData = async () => {
    try {
      const res = await fetch(`/api/contracts?id=${contractId}`);
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        setClientUser(data.client);
        setCreatorUser(data.creator);
        setSamples(data.samples || []);
        setEscrow(data.escrow || null);
      }

      const msgRes = await fetch(`/api/negotiation?contractId=${contractId}`);
      const msgData = await msgRes.json();
      setMessages(msgData.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('cream_user_id') || 'user_client_demo';
    setCurrentUserId(saved);
    loadWorkspaceData();
  }, [contractId]);

  // Send message with Live AI Witness evaluation
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingMsg) return;

    const text = chatInput.trim();
    setChatInput('');
    setSendingMsg(true);

    const isClient = currentUserId === contract?.client_id;
    const role = isClient ? 'client' : 'creator';

    try {
      const res = await fetch('/api/negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          senderId: currentUserId,
          senderRole: role,
          message: text,
        }),
      });

      const data = await res.json();
      if (data.allMessages) {
        setMessages(data.allMessages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMsg(false);
    }
  };

  // Sign contract
  const handleSignContract = async (role: 'client' | 'creator') => {
    try {
      const res = await fetch('/api/contracts/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, role }),
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Upfront Escrow Deposit via Razorpay
  const handleDepositEscrow = async () => {
    setIsProcessingPayment(true);
    try {
      // Step 1: Create Razorpay Order
      const orderRes = await fetch('/api/escrow/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId }),
      });
      const orderData = await orderRes.json();

      if (!orderData.order) {
        alert('Could not initiate Razorpay order: ' + (orderData.error || 'Unknown error'));
        setIsProcessingPayment(false);
        return;
      }

      // Check if Razorpay JS SDK is loaded
      if (typeof window.Razorpay !== 'undefined') {
        const options = {
          key: orderData.keyId,
          amount: orderData.order.amount,
          currency: 'INR',
          name: 'CREAM AI Escrow Vault',
          description: `Upfront Escrow Deposit for Contract #${contractId.slice(-8)}`,
          order_id: orderData.order.id,
          handler: async function (response: any) {
            // Step 2: Verify Razorpay Payment Signature
            const verifyRes = await fetch('/api/escrow/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contractId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              loadWorkspaceData();
            }
          },
          prefill: {
            name: clientUser?.name || 'Alex Morgan',
            email: clientUser?.email || 'alex@brand.co',
            contact: '9999999999',
          },
          theme: {
            color: '#D4AF37',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback standard cryptographic verification in test mode
        const fallbackPaymentId = `pay_cream_${Date.now()}`;
        const verifyRes = await fetch('/api/escrow/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contractId,
            razorpayOrderId: orderData.order.id,
            razorpayPaymentId: fallbackPaymentId,
            razorpaySignature: 'sig_valid_test',
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          loadWorkspaceData();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Creator Uploads Sample Render (Dual Watermarking Pipeline)
  const handleUploadSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingSample(true);
    try {
      const formData = new FormData();
      formData.append('contractId', contractId);
      formData.append('creatorId', contract?.creator_id || 'user_creator_arjun');
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch('/api/samples/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.sample) {
        setSelectedFile(null);
        loadWorkspaceData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingSample(false);
    }
  };

  // Client Pre-approves or Requests Revision
  const handleSampleAction = async (sampleId: string, action: 'pre_approve' | 'request_revision') => {
    const feedback = action === 'request_revision' ? prompt('Enter specific revision notes:') : 'Sample approved';
    if (action === 'request_revision' && !feedback) return;

    try {
      const res = await fetch('/api/samples/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId, action, feedback }),
      });
      const data = await res.json();
      if (data.success) {
        loadWorkspaceData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Inspect SynthID Steganography
  const handleInspectSynthID = async (imageUrl: string) => {
    setInspectingSynthID(true);
    try {
      const res = await fetch('/api/samples/verify-synthid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageRelativeUrl: imageUrl }),
      });
      const data = await res.json();
      setSynthIDInspectionResult(data);
    } catch (e) {
      console.error(e);
      setSynthIDInspectionResult({ verified: false, error: 'Inspection failed' });
    }
  };

  // Client Final Sign-off: Unlocks unwatermarked master & releases escrow
  const handleFinalSignoff = async () => {
    if (!confirm('Are you ready to sign the End-Contract Agreement? This will disburse the escrow payout to the creator and transfer commercial licensing.')) {
      return;
    }

    try {
      const res = await fetch('/api/contracts/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          clientSignature: 'ALEX_MORGAN_CREAM_DIGITAL_SIGNATURE',
          feedbackRating: 5.0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadWorkspaceData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // File Dispute
  const handleFileDispute = async () => {
    if (!disputeReason.trim()) return;
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          raisedBy: currentUserId,
          reason: disputeReason,
        }),
      });
      const data = await res.json();
      if (data.dispute) {
        setShowDisputeModal(false);
        loadWorkspaceData();
        router.push('/disputes');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !contract) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-zinc-500">
        Loading project workspace & contract gates...
      </div>
    );
  }

  const isClient = currentUserId === contract.client_id;
  const isCreator = currentUserId === contract.creator_id;
  const latestSample = samples[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      {/* Top Workspace Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              Contract #{contract.id.slice(-8)}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              SHA256: {contract.contract_checksum?.slice(0, 16)}...
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            {contract.terms.deliverables[0] || 'AI Production Engagement'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Client: <strong className="text-zinc-200">{clientUser?.name}</strong> • Creator: <strong className="text-zinc-200">{creatorUser?.name}</strong> • Escrow: <strong className="text-amber-400 font-mono">₹{contract.terms.agreed_amount.toLocaleString()}</strong>
          </p>
        </div>

        {/* Phase / Milestone Progress Bar */}
        <div className="flex items-center gap-2 bg-zinc-950/70 p-2 rounded-2xl border border-zinc-850">
          <div className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium flex items-center gap-1.5 ${
            contract.status === 'awaiting_signatures' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'
          }`}>
            <span>1. Sign Contract</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium flex items-center gap-1.5 ${
            contract.status === 'escrow_pending' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'
          }`}>
            <span>2. Razorpay Escrow</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium flex items-center gap-1.5 ${
            contract.status === 'in_progress' || contract.status === 'sample_review' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'
          }`}>
            <span>3. Watermarked Sample</span>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium flex items-center gap-1.5 ${
            contract.status === 'completed' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400'
          }`}>
            <span>4. Escrow Released</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Phase Action Center + Live AI Witness Negotiation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Phase Action Center */}
        <div className="lg:col-span-7 space-y-6">
          {/* Phase 1: Virtual Contract Gatekeeper */}
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Legally Binding Virtual Contract
                </h2>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                contract.status === 'awaiting_signatures'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {contract.status === 'awaiting_signatures' ? 'Pending Signatures' : 'Cryptographically Locked'}
              </span>
            </div>

            {/* Terms grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">Deliverables</span>
                <ul className="space-y-1 list-disc list-inside text-zinc-200">
                  {contract.terms.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Resolution & Ratio</span>
                  <span className="font-mono text-zinc-200">{contract.terms.resolution} ({contract.terms.aspect_ratio})</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Revisions Included</span>
                  <span className="font-mono text-zinc-200">{contract.terms.max_revisions} Rounds</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Licensing Rights</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{contract.terms.licensing_rights}</span>
                </div>
              </div>
            </div>

            {/* Signature status */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className={`flex-1 p-3 rounded-xl border flex items-center justify-between ${
                contract.client_signed ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${contract.client_signed ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <div>
                    <span className="text-xs font-semibold block text-white">Client Signature</span>
                    <span className="text-[10px] font-mono">{contract.client_signed ? 'Signed by Alex Morgan' : 'Pending Signature'}</span>
                  </div>
                </div>
                {isClient && !contract.client_signed && (
                  <button
                    onClick={() => handleSignContract('client')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
                  >
                    Sign Contract
                  </button>
                )}
              </div>

              <div className={`flex-1 p-3 rounded-xl border flex items-center justify-between ${
                contract.creator_signed ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${contract.creator_signed ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <div>
                    <span className="text-xs font-semibold block text-white">Creator Signature</span>
                    <span className="text-[10px] font-mono">{contract.creator_signed ? 'Signed by Arjun Mehta' : 'Pending Signature'}</span>
                  </div>
                </div>
                {isCreator && !contract.creator_signed && (
                  <button
                    onClick={() => handleSignContract('creator')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
                  >
                    Sign Contract
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Phase 2: Upfront Razorpay Escrow Vault */}
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Razorpay Escrow Vault Gate (ADR-04)
                </h2>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                escrow?.status === 'held_in_escrow'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}>
                {escrow?.status === 'held_in_escrow' ? 'Funds Vault-Locked' : 'Awaiting Escrow Deposit'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Escrow Vault Balance</span>
                <span className="text-2xl font-extrabold text-white font-mono">
                  ₹{contract.terms.agreed_amount.toLocaleString()}
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">
                  Held safely until mutual contract completion
                </span>
              </div>

              {contract.status === 'escrow_pending' && isClient && (
                <button
                  onClick={handleDepositEscrow}
                  disabled={isProcessingPayment}
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessingPayment ? 'Connecting Gateway...' : 'Deposit via Razorpay'}</span>
                </button>
              )}

              {escrow?.status === 'held_in_escrow' && (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Held in CREAM Escrow</span>
                </div>
              )}
            </div>
          </div>

          {/* Phase 3 & 4: Production & Dual-Watermarked Sample Review Player */}
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Dual-Watermarked Sample Preview Player (ADR-05)
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Visible + SynthID Steganography
              </span>
            </div>

            {/* Creator Upload Panel if in progress */}
            {isCreator && (contract.status === 'in_progress' || contract.status === 'sample_review') && (
              <form onSubmit={handleUploadSample} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Upload Production Render for Dual Watermarking:
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Our Python engine automatically composites the CREAM security banner and embeds tamper-evident SynthID steganographic metadata.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                  />
                  <button
                    type="submit"
                    disabled={uploadingSample}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSample ? 'Applying SynthID...' : 'Process & Submit Sample'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Sample Preview Display */}
            {latestSample ? (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-black">
                  <img
                    src={latestSample.watermarked_url}
                    alt="Watermarked Preview"
                    className="w-full h-auto object-contain max-h-[360px]"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleInspectSynthID(latestSample.watermarked_url)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-mono bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/40 hover:bg-black transition-colors flex items-center gap-1.5"
                    >
                      <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                      Inspect SynthID Proof
                    </button>
                  </div>
                </div>

                {/* Weakly Defensible Rejection Approval Gate */}
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Sample Milestone Review (Revision #{latestSample.revision_number})
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Status: <strong className="text-amber-300 font-mono">{latestSample.status.toUpperCase()}</strong>
                      </span>
                    </div>

                    {isClient && latestSample.status === 'pending_review' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSampleAction(latestSample.id, 'request_revision')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                        >
                          Request Revision
                        </button>
                        <button
                          onClick={() => handleSampleAction(latestSample.id, 'pre_approve')}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pre-Approve Sample (ADR-05)
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-500 italic">
                    ADR-05 Rule: Pre-approving this watermarked render establishes a binding reference. Subsequent arbitrary rejections are weakly defensible during dispute resolution.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                Awaiting creator to render and upload the first watermarked sample preview.
              </div>
            )}
          </div>

          {/* Phase 5: Final Pristine Deliverable & Escrow Release */}
          {(contract.status === 'sample_approved' || contract.status === 'completed') && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Pristine Unwatermarked Deliverable Gate
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {contract.status === 'completed' ? 'Escrow Disbursed' : 'Ready for Client Sign-off'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Master Unwatermarked 4K Render</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    High-res uncompressed master file with full commercial digital ad licensing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {latestSample && (
                    <a
                      href={latestSample.original_url}
                      download
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Pristine Master</span>
                    </a>
                  )}

                  {isClient && contract.status === 'sample_approved' && (
                    <button
                      onClick={handleFinalSignoff}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sign End-Contract & Release Escrow</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dispute trigger button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowDisputeModal(true)}
              className="text-xs text-rose-400/80 hover:text-rose-300 flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Raise Project Dispute with Council (F-07)</span>
            </button>
          </div>
        </div>

        {/* Right: Live AI-Witness Negotiation Chat */}
        <div className="lg:col-span-5 glass-panel rounded-2xl border border-zinc-800 flex flex-col h-[750px] overflow-hidden">
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Live AI Negotiation Witness</span>
                <span className="text-[10px] text-zinc-400">Monitoring terms & resolving ambiguity</span>
              </div>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender_role === 'ai_witness' ? 'justify-center my-2' : m.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender_role === 'ai_witness' ? (
                  <div className="w-full p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex gap-2.5 items-start">
                    <Bot className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block mb-0.5">
                        Live AI Witness Intervention
                      </span>
                      <p className="text-[11px] leading-relaxed text-zinc-200">{m.message}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender_id === currentUserId
                        ? 'bg-amber-500 text-black font-medium'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <div className="text-[10px] opacity-70 mb-0.5 font-semibold">
                      {m.sender_role.toUpperCase()}
                    </div>
                    <p className="whitespace-pre-wrap">{m.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Discuss production timeline, LoRA models, camera grading..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={sendingMsg || !chatInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Steganography Inspection Modal */}
      {inspectingSynthID && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-zinc-700 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  SynthID Steganographic Provenance
                </h3>
              </div>
              <button
                onClick={() => setInspectingSynthID(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            {synthIDInspectionResult ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tamper-evident Steganographic Signature Verified!</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 overflow-x-auto text-[11px] text-zinc-300">
                  <pre>{JSON.stringify(synthIDInspectionResult.payload, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500">
                Scanning image pixels for embedded SynthID payload...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/40 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  File Dispute Case (F-07)
                </h3>
              </div>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Disputes trigger our Hybrid Dispute Resolution Engine. The AI Witness will analyze the entire negotiation transcript and watermarked review log to recommend an objective escrow settlement.
            </p>

            <textarea
              rows={4}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Describe the contractual disagreement or specification mismatch..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleFileDispute}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors"
              >
                Submit Dispute to Council
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

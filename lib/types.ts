export type UserRole = 'client' | 'creator' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string;
  is_digilocker_verified: boolean;
  digilocker_aadhaar_ref?: string;
  digilocker_verified_at?: string;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  thumbnail_url: string;
  media_type: 'video' | 'image' | '3d';
  tools_used: string[];
  workflow_description: string;
  prompt_snippet?: string;
  verified_render: boolean;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  tagline: string;
  tools: string[];
  workflows: string[];
  specializations: string[];
  hourly_rate: number;
  min_project_budget: number;
  rating: number;
  completed_projects: number;
  verified_badges: string[];
  portfolio_items: PortfolioItem[];
  embedding?: number[];
  created_at: string;
}

export interface BriefStructured {
  id: string;
  client_id: string;
  title: string;
  content_type: 'video' | 'still_graphic' | 'animation' | 'audio_visual';
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:5';
  camera_angles: string[];
  style_benchmarks: string[];
  model_preferences: string[];
  commercial_rights: 'digital_ad' | 'broadcast' | 'perpetual_exclusive' | 'non_exclusive';
  budget_min: number;
  budget_max: number;
  deadline_days: number;
  key_elements: string;
  raw_transcript: Array<{ role: 'client' | 'assistant'; text: string; timestamp: string }>;
  status: 'draft' | 'published' | 'matched' | 'in_negotiation' | 'contracted';
  created_at: string;
}

export interface ContractTerms {
  deliverables: string[];
  resolution: string;
  aspect_ratio: string;
  max_revisions: number;
  deadline: string;
  licensing_rights: string;
  agreed_amount: number;
  escrow_milestones: Array<{ name: string; percent: number }>;
}

export type ContractStatus =
  | 'draft'
  | 'awaiting_signatures'
  | 'escrow_pending'
  | 'in_progress'
  | 'sample_review'
  | 'sample_approved'
  | 'final_review'
  | 'completed'
  | 'disputed';

export interface VirtualContract {
  id: string;
  brief_id: string;
  client_id: string;
  creator_id: string;
  terms: ContractTerms;
  client_signed: boolean;
  creator_signed: boolean;
  client_signed_at?: string;
  creator_signed_at?: string;
  contract_checksum?: string;
  status: ContractStatus;
  created_at: string;
}

export interface EscrowTransaction {
  id: string;
  contract_id: string;
  client_id: string;
  creator_id: string;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  status: 'created' | 'held_in_escrow' | 'released' | 'refunded' | 'partial_refund';
  payout_bank_account?: string;
  released_at?: string;
  created_at: string;
}

export interface SampleRender {
  id: string;
  contract_id: string;
  creator_id: string;
  original_url: string;
  watermarked_url: string;
  synthid_payload: {
    platform: string;
    synthid_version: string;
    creator_name: string;
    creator_id: string;
    contract_id: string;
    asset_sha256: string;
    timestamp_unix: number;
    status: string;
  };
  status: 'pending_review' | 'revision_requested' | 'pre_approved';
  client_feedback?: string;
  revision_number: number;
  submitted_at: string;
}

export interface DisputeCase {
  id: string;
  contract_id: string;
  raised_by: string;
  reason: string;
  ai_analysis?: {
    transcript_summary: string;
    sample_compliance_score: number;
    recommendation: string;
    suggested_split: { creator_percent: number; client_percent: number };
  };
  resolution_status: 'opened' | 'ai_analyzed' | 'resolved';
  final_settlement?: {
    action: 'creator_payout' | 'client_refund' | 'split';
    creator_amount: number;
    client_amount: number;
    resolved_by: string;
    timestamp: string;
  };
  resolved_at?: string;
  created_at: string;
}

export interface NegotiationMessage {
  id: string;
  contract_id: string;
  brief_id?: string;
  sender_id: string;
  sender_role: 'client' | 'creator' | 'ai_witness';
  message: string;
  is_ai_witness: boolean;
  ai_witness_note?: string;
  created_at: string;
}

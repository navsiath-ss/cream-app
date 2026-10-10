-- CREAM AI Creator Marketplace Schema with pgvector
-- Initial Migration

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'creator', 'admin')),
    avatar_url TEXT,
    is_digilocker_verified BOOLEAN DEFAULT FALSE,
    digilocker_aadhaar_ref TEXT, -- Only SHA256 token ref per ADR-02
    digilocker_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Creator Profiles Table
CREATE TABLE IF NOT EXISTS creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    tagline TEXT,
    tools TEXT[] DEFAULT '{}',
    workflows TEXT[] DEFAULT '{}',
    specializations TEXT[] DEFAULT '{}',
    hourly_rate NUMERIC DEFAULT 0,
    min_project_budget NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    completed_projects INT DEFAULT 0,
    verified_badges TEXT[] DEFAULT '{}',
    portfolio_items JSONB DEFAULT '[]'::jsonb,
    embedding vector(1536), -- Semantic vector embeddings for discovery
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI Briefs Table
CREATE TABLE IF NOT EXISTS briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL,
    camera_angles TEXT[] DEFAULT '{}',
    style_benchmarks TEXT[] DEFAULT '{}',
    model_preferences TEXT[] DEFAULT '{}',
    commercial_rights TEXT NOT NULL,
    budget_min NUMERIC DEFAULT 0,
    budget_max NUMERIC DEFAULT 0,
    deadline_days INT DEFAULT 7,
    key_elements TEXT,
    raw_transcript JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'matched', 'in_negotiation', 'contracted')),
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Virtual Contracts Table
CREATE TABLE IF NOT EXISTS virtual_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    terms JSONB NOT NULL,
    client_signed BOOLEAN DEFAULT FALSE,
    creator_signed BOOLEAN DEFAULT FALSE,
    client_signed_at TIMESTAMPTZ,
    creator_signed_at TIMESTAMPTZ,
    contract_checksum TEXT,
    status TEXT DEFAULT 'awaiting_signatures' CHECK (status IN ('draft', 'awaiting_signatures', 'escrow_pending', 'in_progress', 'sample_review', 'sample_approved', 'final_review', 'completed', 'disputed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Escrow Transactions Table
CREATE TABLE IF NOT EXISTS escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES virtual_contracts(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    status TEXT DEFAULT 'held_in_escrow' CHECK (status IN ('created', 'held_in_escrow', 'released', 'refunded', 'partial_refund')),
    payout_bank_account TEXT,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sample Renders Table (Dual Watermarked)
CREATE TABLE IF NOT EXISTS sample_renders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES virtual_contracts(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    watermarked_url TEXT NOT NULL,
    synthid_payload JSONB,
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'revision_requested', 'pre_approved')),
    client_feedback TEXT,
    revision_number INT DEFAULT 1,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Dispute Cases Table
CREATE TABLE IF NOT EXISTS dispute_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES virtual_contracts(id) ON DELETE CASCADE,
    raised_by UUID REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    ai_analysis JSONB,
    resolution_status TEXT DEFAULT 'opened' CHECK (resolution_status IN ('opened', 'ai_analyzed', 'resolved')),
    final_settlement JSONB,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Negotiation Messages Table
CREATE TABLE IF NOT EXISTS negotiation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES virtual_contracts(id) ON DELETE CASCADE,
    brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
    sender_id UUID,
    sender_role TEXT CHECK (sender_role IN ('client', 'creator', 'ai_witness')),
    message TEXT NOT NULL,
    is_ai_witness BOOLEAN DEFAULT FALSE,
    ai_witness_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for deterministic search & performance
CREATE INDEX IF NOT EXISTS idx_creators_rating ON creator_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_creators_budget ON creator_profiles(min_project_budget ASC);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON virtual_contracts(status);
CREATE INDEX IF NOT EXISTS idx_escrow_contract ON escrow_transactions(contract_id);

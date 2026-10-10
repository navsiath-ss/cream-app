# Document 14: Detailed Expansive Product Requirements Document (PRD)

## 1. Executive Summary
The **CREAM AI Creator Marketplace** connects top-tier generative AI creators with brands and creative agencies. This document establishes full functional and non-functional specifications.

## 2. User Personas
- **Brand Manager / Agency Buyer ("Client")**: Needs high-quality AI video, graphics, and animations; lacks technical prompting skill; requires commercial licensing and secure payment management.
- **AI Content Creator ("Creator")**: Specializes in generative tools (Midjourney, Stable Diffusion, ComfyUI, Runway); requires protection against asset theft and guaranteed payment.

## 3. Detailed Functional Modules

### Module 1: Onboarding & Identity (EPIC-1)
- **REQ-1.1**: User registration via Supabase SSO (Google, Apple).
- **REQ-1.2**: Mandatory KYC identity verification via DigiLocker API integration.
- **REQ-1.3**: Identity badge assignment upon successful verification.

### Module 2: AI Brief Building & Matching (EPIC-2)
- **REQ-2.1**: Conversational LLM interface extracting content type, style, aspect ratio, models, and usage rights.
- **REQ-2.2**: Generation of structured JSON brief.
- **REQ-2.3**: Deterministic SQL/pgvector database search matching briefs against creator profile attributes.

### Module 3: Negotiation, Contracting & Escrow (EPIC-3)
- **REQ-3.1**: Context-preserved briefing transferred to creator AI assistant.
- **REQ-3.2**: Live AI witness tracking negotiations and auto-drafting virtual contracts.
- **REQ-3.3**: Advance payment capture and escrow hold via Razorpay / ICICI / HDFC.

### Module 4: Production, Watermarking & Approval (EPIC-4)
- **REQ-4.1**: Upload of sample renders with automatic visible branding and SynthID steganographic watermarking.
- **REQ-4.2**: Client sample pre-approval interface before final production.
- **REQ-4.3**: Release of unwatermarked assets upon final contract end sign-off.

### Module 5: Dispute Resolution & Metadata Tracking (EPIC-5)
- **REQ-5.1**: Hybrid AI/human dispute resolution console for escrow refunds.
- **REQ-5.2**: Automatic project metadata ingestion into creator portfolio ranking vectors.

## 4. Evaluation Criteria Alignment Matrix
- **Creator Profiles & AI Portfolios (30%)**: Verified skills, tools, workflows, render showcases.
- **Brief Definition (20%)**: Complete capturing of content type, style, format, aspect ratio, usage rights.
- **Discovery & Filtering (25%)**: Accurate programmatic matching via SQL + pgvector search.
- **User Experience (15%)**: Frictionless SSO/DigiLocker onboarding, conversational UI, watermarked preview.
- **Presentation & Architecture (10%)**: Production-ready architectural documents.

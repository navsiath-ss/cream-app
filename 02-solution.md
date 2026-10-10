# Document 02: System Solution & Core Mechanism

## 1. Architectural Strategy: Offloading Core Liabilities
To solve security, identity, payment, and trust challenges without heavy capital expenditure, CREAM offloads critical infrastructure to trusted third-party providers:
- **Authentication**: Third-party Single Sign-On (SSO via Google, Apple) managed by **Supabase Auth**. CREAM stores no user passwords, eliminating password exposure risks.
- **Identity Verification & KYC**: Integration with **DigiLocker** (government identity verification). Users verify identities via government credentials without uploading sensitive ID documents to CREAM servers.
- **Escrow & Payments**: Integrated with tier-1 payment gateways (**Razorpay, ICICI, HDFC**). Client funds are collected in advance and held in escrow until mutual project completion.

## 2. Content Security & IP Protection Strategy
Digital content exchange carries inherent piracy and misuse risks. CREAM deploys a multi-layered defence:
- **Gated Virtual Contracts**: Progress through every project stage (discovery, work start, sample review, final release) is hard-gated by legally binding virtual contracts.
- **Dual Watermarking Pipeline**: Sample previews shown to clients feature both visible watermarks (CREAM + Creator branding) and invisible steganographic watermarks (including **SynthID** technology) to prevent unauthorized recording or screen-capturing prior to escrow release.

## 3. Hybrid AI + Program Architecture
To bridge the gap between natural language requirement discovery and deterministic database matching:
1. **Conversational LLM Interface**: A conversational AI engages clients in friendly dialogue to extract structured campaign parameters.
2. **Deterministic Database Search**: The AI exports structured query parameters to a programmatic database engine. The LLM does not execute direct DB queries, preventing context overflow and hallucinated search results.
3. **Structured Context Preservation**: Exact conversation transcripts and metadata are preserved and passed to the creator-side AI assistant.
4. **Live AI Witness**: During negotiations, an AI assistant acts as an active third-party witness, synthesizing agreed terms into non-bypassable virtual contracts.
5. **Human-in-the-Loop Dispute Resolution**: Rejections are weakly defensible by design (clients must pre-approve samples). If disputes arise, a hybrid team of AI analysts and human specialists reviews transcripts and samples to execute full or partial escrow refunds.

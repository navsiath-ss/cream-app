# Document 07: Tech Stack Specification

| Category | Component / Technology | Justification & Role |
|---|---|---|
| **Frontend Framework** | Next.js 14 / React | Server-side rendering, fast load times, robust API route handling |
| **Styling & UI Components** | Tailwind CSS / Shadcn UI | Rapid design iteration, accessible and clean user interfaces |
| **Authentication** | Supabase Auth (SSO) | Delegates Google/Apple OAuth 2.0; zero password storage liability |
| **KYC / Verification** | DigiLocker REST API | Official government identity validation without storing physical IDs |
| **Database (Relational)** | PostgreSQL (via Supabase) | Structural integrity for users, briefs, contracts, escrow states |
| **Database (Vector)** | pgvector Extension | Stores semantic vector embeddings for creator portfolios & briefs |
| **AI / LLM Orchestration** | OpenAI GPT-4o / Anthropic Claude 3.5 | Requirements extraction, live negotiation witness, contract drafting |
| **Payments & Escrow** | Razorpay / ICICI / HDFC Gateway APIs | High-trust advance payment collection and escrow holding |
| **Media Watermarking** | FFmpeg, Python Pillow, SynthID API | Dual-layer visible and invisible watermarking for sample protection |
| **Cloud Storage** | AWS S3 / Cloudflare R2 | Encrypted media asset storage with temporary signed URL access |

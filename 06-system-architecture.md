# Document 06: System Architecture

## 1. Architectural Layers

### Layer 1: Client & Presentation Layer
- **Tech**: Next.js / React frontend, Tailwind CSS, Web GL media player.
- **Function**: Responsive web interface for clients and creators, conversational AI chat window, watermarked sample player.

### Layer 2: Authentication & Security Gateways
- **Tech**: Supabase SSO (OAuth 2.0 for Google/Apple), DigiLocker Identity API.
- **Function**: User authentication without local password storage; zero-server-storage identity verification.

### Layer 3: AI Conversational & Parsing Engine
- **Tech**: LLM Gateway (OpenAI / Anthropic), Structured JSON Parser, Prompt & Context Store.
- **Function**: Brief extraction chat, live negotiation witness, conversation context preservation, contract drafting.

### Layer 4: Core Business Logic & Programmatic Search
- **Tech**: Python API Services, Deterministic Search Engine, Contract Gatekeeper.
- **Function**: Executes parametric database queries, manages non-bypassable contract states, orchestrates workflow gates.

### Layer 5: Data & Vector Storage Layer
- **Tech**: PostgreSQL (relational metadata, contracts, transactions), pgvector (semantic vector embeddings for creator skills/attributes).
- **Function**: Relational integrity for escrow/contracts; semantic similarity matching for unstructured creator profiles.

### Layer 6: Media Processing & Watermarking Engine
- **Tech**: FFmpeg, Pillow, SynthID Integration API, S3-compatible Encrypted Storage.
- **Function**: Asset uploads, automatic visible branding overlay, steganographic watermarking, secure sample preview streaming.

### Layer 7: Escrow & Payment Gateway
- **Tech**: Razorpay, ICICI Bank API, HDFC Bank API.
- **Function**: Advance payment capture, platform escrow hold, automated/dispute payouts.

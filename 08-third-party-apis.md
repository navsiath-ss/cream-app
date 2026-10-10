# Document 08: Third-Party API Integrations

## 1. Supabase SSO Integration
- **Purpose**: User registration and login via Google, Apple, and OAuth 2.0 providers.
- **Security Impact**: CREAM databases store zero password hashes or salt keys.

## 2. DigiLocker Government ID API
- **Purpose**: Automated KYC identity verification for clients and creators.
- **Security Impact**: Users verify identity via official government tokens; zero raw ID documents uploaded to or stored on platform servers.

## 3. Razorpay / ICICI / HDFC Escrow APIs
- **Purpose**: Upfront payment capture, escrow holding, and merchant payout disbursement.
- **Security Impact**: Offloads PCI-DSS compliance and banking security to tier-1 financial institutions.

## 4. LLM API Infrastructure (OpenAI / Anthropic)
- **Purpose**: Natural language conversational requirements gathering, context preservation across client-creator sessions, live negotiation monitoring, and contract generation.
- **Control Mechanism**: Outputs strictly parsed into structured JSON to trigger deterministic backend business logic.

## 5. SynthID & Steganographic Watermarking API
- **Purpose**: Embeds imperceptible digital watermarks into creator sample videos and images.
- **Security Impact**: Protects creators against client screenshotting, screen recording, and unauthorized asset usage prior to full payment release.

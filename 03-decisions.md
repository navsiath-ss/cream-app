# Document 03: Architectural Decision Records (ADRs)

## ADR-01: Offload User Authentication to Supabase SSO
- **Status**: Accepted
- **Context**: Storing passwords creates immense liability for a new platform.
- **Decision**: Delegate authentication entirely to Supabase SSO (Google, Apple).
- **Consequence**: Zero password storage overhead; increased user sign-up speed and platform trust.

## ADR-02: Zero-Storage KYC via DigiLocker
- **Status**: Accepted
- **Context**: Government ID collection is mandatory to combat fraud, but hosting ID documents creates data leak vulnerabilities.
- **Decision**: Integrate DigiLocker API to verify identities directly via official government records.
- **Consequence**: Zero storage of raw identity documents on CREAM infrastructure.

## ADR-03: Decouple Conversational AI from Direct Database Querying
- **Status**: Accepted
- **Context**: LLMs experience hallucinations and context overflow when scanning dynamic database tables.
- **Decision**: Use LLMs solely for natural language parsing and structured parameter extraction; execute database lookups via deterministic program logic.
- **Consequence**: 100% accurate database matching with zero hallucinated creator profiles.

## ADR-04: Upfront Escrow Holding via Razorpay / ICICI / HDFC
- **Status**: Accepted
- **Context**: Creators fear non-payment; brands fear non-delivery.
- **Decision**: Mandate upfront client payment into a platform escrow vault managed via tier-1 payment gateways before work begins.
- **Consequence**: Creators gain production confidence; brand capital remains protected until sample confirmation.

## ADR-05: Dual Watermarking with Weakly Defensible Rejections
- **Status**: Accepted
- **Context**: Clients may record/steal sample preview work and reject final deliverables to evade payment.
- **Decision**: Enforce visible + invisible (SynthID) watermarks on all sample previews, making final rejections weakly defensible if samples were confirmed.
- **Consequence**: Mitigates digital piracy and protects creator intellectual property.

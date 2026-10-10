# Document 05: User Flow (Creator & Client)

## 1. Client User Flow
```
[Client Sign Up] --> [Supabase SSO] --> [DigiLocker Identity Verification]
       |
       v
[AI Brief Builder Chat] --> [Structured Brief Generation]
       |
       v
[Programmatic Creator Search] --> [Review Portfolios & Shortlist]
       |
       v
[Connect with Creator] --> [Live AI-Monitored Negotiation]
       |
       v
[Sign Virtual Contract] --> [Deposit Funds into Escrow]
       |
       v
[Review Watermarked Samples] --> [Approve Samples / Request Revisions]
       |
       v
[Approve Final Deliverables] --> [Sign End-Contract Agreement] --> [Escrow Payout Released]
```

## 2. Creator User Flow
```
[Creator Sign Up] --> [Supabase SSO] --> [DigiLocker Identity Verification]
       |
       v
[Build AI Portfolio] (Tools, Workflows, LoRAs, Render Samples)
       |
       v
[Receive Incoming Brief/Offer] (AI Explains Brief with Preserved Client Context)
       |
       v
[Connect with Client] --> [Live AI-Monitored Negotiation]
       |
       v
[Sign Virtual Contract] --> [Escrow Confirmation Received]
       |
       v
[Produce & Upload Samples] (Dual Watermarks Automatically Applied)
       |
       v
[Client Sample Approval] --> [Deliver Unwatermarked Final Assets]
       |
       v
[Sign End-Contract Agreement] --> [Escrow Payout to Bank] --> [Metadata Added to Profile]
```

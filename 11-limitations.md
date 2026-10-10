# Document 11: Platform Limitations & Risk Analysis

## 1. Identified Constraints & Risks

1. **Third-Party Service Dependency**:
   - Downtime or API policy changes in Supabase, DigiLocker, or payment gateways directly impact authentication, KYC, or payouts.

2. **Regional KYC Bottleneck**:
   - DigiLocker integration is specific to India. International expansion requires integrating secondary KYC providers (e.g., Onfido, Persona).

3. **Human Dispute Overhead**:
   - While AI handles initial transcript analysis, final complex contract cancellations and refund disputes rely on human specialist review, creating a potential scaling bottleneck.

4. **LLM Inference Latency & Cost**:
   - Real-time AI negotiation monitoring introduces token costs and slight response latency during active user discussions.

5. **Off-Platform Communication Risk**:
   - Users may attempt to bypass CREAM after discovering each other, circumventing platform fees and escrow protections.

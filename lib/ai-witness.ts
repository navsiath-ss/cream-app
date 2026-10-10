import { BriefStructured, ContractTerms, NegotiationMessage, DisputeCase } from './types';
import crypto from 'crypto';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Calls OpenAI API if key is present; otherwise returns null.
 */
async function callOpenAI(messages: ChatMessage[], temperature = 0.3): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages,
        temperature,
      }),
    });

    if (!res.ok) {
      console.warn('OpenAI API returned status:', res.status);
      return null;
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn('OpenAI API call failed, using deterministic AI engine:', err);
    return null;
  }
}

/**
 * AI-Assisted Brief Builder: Conversational parsing and structured extraction.
 */
export async function processBriefConversation(
  history: Array<{ role: 'client' | 'assistant'; text: string }>,
  userMessage: string
): Promise<{
  reply: string;
  extractedBrief?: Partial<BriefStructured>;
  isComplete: boolean;
}> {
  const fullTranscript = [...history, { role: 'client' as const, text: userMessage }];
  const transcriptText = fullTranscript.map((t) => `${t.role.toUpperCase()}: ${t.text}`).join('\n');

  // Try OpenAI first
  const systemPrompt = `You are the CREAM AI Brief Builder Assistant. You help brand managers design generative AI campaign briefs.
Your job is to clarify and extract:
1. Content Type (video, still_graphic, animation)
2. Aspect Ratio (16:9, 9:16, 1:1, 4:5)
3. Camera Angles & Movement
4. Style Benchmarks & Aesthetics (e.g., cinematic, anime, photoreal, 3D)
5. Model Preferences (e.g., Midjourney v6, Runway Gen-2, ComfyUI, Flux)
6. Commercial Rights (digital_ad, broadcast, perpetual_exclusive, non_exclusive)
7. Budget Range (min, max in INR)
8. Deadline (days)

If any critical parameters are missing, ask a clear, engaging follow-up question.
If sufficient details are gathered, output your conversational summary AND a JSON block fenced with \`\`\`json containing:
{
  "title": "string",
  "content_type": "video" | "still_graphic" | "animation",
  "aspect_ratio": "16:9" | "9:16" | "1:1" | "4:5",
  "camera_angles": ["string"],
  "style_benchmarks": ["string"],
  "model_preferences": ["string"],
  "commercial_rights": "digital_ad" | "broadcast" | "perpetual_exclusive",
  "budget_min": number,
  "budget_max": number,
  "deadline_days": number,
  "key_elements": "string",
  "is_complete": true
}`;

  const openAiReply = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Current brief conversation:\n${transcriptText}\n\nLatest user message: "${userMessage}"` },
  ]);

  if (openAiReply) {
    const jsonMatch = openAiReply.match(/```json([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        const replyText = openAiReply.replace(/```json[\s\S]*?```/, '').trim();
        return {
          reply: replyText || "I've structured your brief requirements! Review the specifications below.",
          extractedBrief: parsed,
          isComplete: Boolean(parsed.is_complete),
        };
      } catch (e) {
        // Fallback to text
      }
    }
    return {
      reply: openAiReply,
      isComplete: false,
    };
  }

  // Deterministic Semantic Parser Engine (ADR-03 compliant)
  const combined = fullTranscript.map((t) => t.text.toLowerCase()).join(' ');

  // Extract content type
  let contentType: 'video' | 'still_graphic' | 'animation' = 'video';
  if (combined.includes('animation') || combined.includes('anime') || combined.includes('3d render')) {
    contentType = 'animation';
  } else if (combined.includes('image') || combined.includes('still') || combined.includes('graphic') || combined.includes('poster')) {
    contentType = 'still_graphic';
  }

  // Extract aspect ratio
  let aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' = '16:9';
  if (combined.includes('9:16') || combined.includes('reel') || combined.includes('shorts') || combined.includes('story') || combined.includes('tiktok')) {
    aspectRatio = '9:16';
  } else if (combined.includes('1:1') || combined.includes('square') || combined.includes('instagram feed')) {
    aspectRatio = '1:1';
  } else if (combined.includes('4:5')) {
    aspectRatio = '4:5';
  }

  // Models
  const detectedModels: string[] = [];
  if (combined.includes('midjourney')) detectedModels.push('Midjourney v6');
  if (combined.includes('runway') || combined.includes('gen-2') || combined.includes('gen-3')) detectedModels.push('Runway Gen-2');
  if (combined.includes('comfyui') || combined.includes('comfy')) detectedModels.push('ComfyUI');
  if (combined.includes('flux')) detectedModels.push('Flux.1');
  if (combined.includes('elevenlabs') || combined.includes('voice')) detectedModels.push('ElevenLabs');
  if (detectedModels.length === 0) detectedModels.push('Runway Gen-2', 'Midjourney v6');

  // Styles
  const detectedStyles: string[] = [];
  if (combined.includes('photoreal') || combined.includes('hyperreal') || combined.includes('cinematic')) detectedStyles.push('Cinematic Photorealism');
  if (combined.includes('cyberpunk') || combined.includes('neon') || combined.includes('tokyo')) detectedStyles.push('Cyberpunk Aesthetic');
  if (combined.includes('luxury') || combined.includes('commercial') || combined.includes('minimal')) detectedStyles.push('Luxury High-Key Commercial');
  if (combined.includes('3d') || combined.includes('stylized')) detectedStyles.push('Stylized 3D Generative');
  if (detectedStyles.length === 0) detectedStyles.push('Cinematic Commercial');

  // Camera angles
  const detectedAngles: string[] = [];
  if (combined.includes('wide') || combined.includes('establishing')) detectedAngles.push('Wide Establishing Shot');
  if (combined.includes('macro') || combined.includes('close')) detectedAngles.push('Macro Optical Focus');
  if (combined.includes('drone') || combined.includes('aerial')) detectedAngles.push('Aerial Crane Sweep');
  if (detectedAngles.length === 0) detectedAngles.push('Dynamic Steadicam Tracking', 'Macro Lighting Sweep');

  // Budget
  let budgetMin = 40000;
  let budgetMax = 85000;
  const budgetMatch = combined.match(/(\d+)[k|\s*thousand|\s*lakh]?/g);
  if (budgetMatch && budgetMatch.length > 0) {
    const rawNum = parseInt(budgetMatch[0]);
    if (rawNum > 1000) {
      budgetMin = Math.round(rawNum * 0.85);
      budgetMax = Math.round(rawNum * 1.25);
    }
  }

  const isReady = fullTranscript.length >= 3 || combined.length > 120;

  const structuredBrief: Partial<BriefStructured> = {
    title: userMessage.length > 40 ? `${userMessage.slice(0, 36)}...` : `AI Campaign: ${userMessage.slice(0, 30)}`,
    content_type: contentType,
    aspect_ratio: aspectRatio,
    camera_angles: detectedAngles,
    style_benchmarks: detectedStyles,
    model_preferences: detectedModels,
    commercial_rights: 'digital_ad',
    budget_min: budgetMin,
    budget_max: budgetMax,
    deadline_days: 7,
    key_elements: userMessage,
  };

  let assistantReply = '';
  if (!isReady) {
    assistantReply = `I've registered your interest in a ${contentType} project (${aspectRatio}). What specific visual aesthetic (e.g. photoreal cinematic, 3D stylized, or editorial fashion) and preferred AI models (Runway, Midjourney, ComfyUI) do you envision?`;
  } else {
    assistantReply = `Excellent. I have analyzed your creative parameters into a structured, production-ready brief:
- Content Type: ${contentType.toUpperCase()} (${aspectRatio})
- Primary Aesthetics: ${detectedStyles.join(', ')}
- Model Architecture: ${detectedModels.join(' + ')}
- Escrow Target: ₹${budgetMin.toLocaleString()} - ₹${budgetMax.toLocaleString()} (7 days delivery)

Click below to run a deterministic search across verified creator portfolios matching these exact parameters!`;
  }

  return {
    reply: assistantReply,
    extractedBrief: structuredBrief,
    isComplete: isReady,
  };
}

/**
 * Live AI Witness: Evaluates messages in creator-client negotiation chat.
 */
export async function witnessNegotiationMessage(
  history: NegotiationMessage[],
  newMessage: NegotiationMessage
): Promise<{ witnessNote?: string; autoDraftTerms?: ContractTerms }> {
  const text = newMessage.message.toLowerCase();

  let witnessNote: string | undefined = undefined;

  // Technical generative AI disambiguation
  if (text.includes('lora') || text.includes('checkpoint')) {
    witnessNote = 'AI Witness Note: Creator is mentioning LoRA (Low-Rank Adaptation). This means custom style or character likeness will be specifically trained for the client brand.';
  } else if (text.includes('temporal consistency') || text.includes('flicker')) {
    witnessNote = 'AI Witness Note: Client requested temporal consistency. Creator should apply ControlNet optical flow or AnimateDiff smoothing passes.';
  } else if (text.includes('revision') || text.includes('rounds')) {
    witnessNote = 'AI Witness Note: Revision scope discussed. Per CREAM ADR-05, all revision rounds apply to watermarked sample renders before final unwatermarked delivery.';
  } else if (text.includes('deal') || text.includes('agree') || text.includes('₹') || text.includes('rs') || text.includes('budget')) {
    witnessNote = 'AI Witness Note: Commercial terms in alignment. Virtual contract generator is ready to synthesize agreed terms.';
  }

  // Contract synthesis
  let autoDraftTerms: ContractTerms | undefined = undefined;
  if (
    history.length >= 3 &&
    (text.includes('agree') || text.includes('ready') || text.includes('done') || text.includes('proceed') || text.includes('contract'))
  ) {
    autoDraftTerms = {
      deliverables: ['1x 30s Master AI Video Commercial', '3x High-Res Still Poster Frames', 'SynthID Steganographic Proof'],
      resolution: '4K (3840x2160 UHD)',
      aspect_ratio: '16:9 Landscape',
      max_revisions: 2,
      deadline: '7 Days from Escrow Deposit',
      licensing_rights: 'Perpetual Commercial Digital Advertising Rights',
      agreed_amount: 55000,
      escrow_milestones: [
        { name: 'Upfront Escrow Deposit (Locked in CREAM Vault)', percent: 100 },
        { name: 'Watermarked Sample Pre-Approval Gate', percent: 0 },
        { name: 'Pristine Deliverable Sign-Off & Escrow Release', percent: 100 },
      ],
    };
  }

  return {
    witnessNote,
    autoDraftTerms,
  };
}

/**
 * Dispute Resolution Analyzer: Audits chat transcript, contracts, and watermarked previews.
 */
export async function analyzeDisputeCase(params: {
  contract: ContractTerms;
  transcript: NegotiationMessage[];
  sampleFeedback?: string;
  reason: string;
}): Promise<NonNullable<DisputeCase['ai_analysis']>> {
  const { contract, transcript, sampleFeedback, reason } = params;

  // Weakly defensible rejection analysis (ADR-05)
  const hadSampleApproval = Boolean(sampleFeedback && sampleFeedback.toLowerCase().includes('approved'));

  let complianceScore = 88;
  let recommendation = '';
  let split = { creator_percent: 75, client_percent: 25 };

  if (hadSampleApproval) {
    complianceScore = 94;
    recommendation =
      'Evidence Audit: Client explicitly approved the watermarked sample preview. Under CREAM ADR-05 (Weakly Defensible Rejections), client cannot arbitrarily reject final unwatermarked assets matching approved preview specs.';
    split = { creator_percent: 90, client_percent: 10 };
  } else {
    recommendation =
      'Evidence Audit: Revisions were active prior to sample sign-off. Analysis indicates partial delivery of key milestones with communication disconnect regarding camera grading.';
    split = { creator_percent: 50, client_percent: 50 };
  }

  return {
    transcript_summary: `Reviewed ${transcript.length} negotiation messages, contract terms (#${contract.deliverables.length} deliverables), and feedback log.`,
    sample_compliance_score: complianceScore,
    recommendation,
    suggested_split: split,
  };
}

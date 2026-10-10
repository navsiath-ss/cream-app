import fs from 'fs';
import path from 'path';
import {
  User,
  CreatorProfile,
  BriefStructured,
  VirtualContract,
  EscrowTransaction,
  SampleRender,
  DisputeCase,
  NegotiationMessage,
} from './types';

interface DatabaseSchema {
  users: User[];
  creator_profiles: CreatorProfile[];
  briefs: BriefStructured[];
  virtual_contracts: VirtualContract[];
  escrow_transactions: EscrowTransaction[];
  sample_renders: SampleRender[];
  dispute_cases: DisputeCase[];
  negotiation_messages: NegotiationMessage[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'cream_db.json');

// Initial seed data representing real tier-1 AI creators as defined in Document 01 & 04
const INITIAL_SEED_USERS: User[] = [
  {
    id: 'user_client_demo',
    email: 'alex.morgan@apexbrand.co',
    name: 'Alex Morgan',
    role: 'client',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    is_digilocker_verified: true,
    digilocker_aadhaar_ref: 'DL_REF_SHA256_9c82e17bf923a',
    digilocker_verified_at: '2026-09-15T10:00:00Z',
    created_at: '2026-09-01T08:30:00Z',
  },
  {
    id: 'user_creator_arjun',
    email: 'arjun.vfx@hyperreal.ai',
    name: 'Arjun Mehta',
    role: 'creator',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    is_digilocker_verified: true,
    digilocker_aadhaar_ref: 'DL_REF_SHA256_fa876b0098c',
    digilocker_verified_at: '2026-08-20T14:22:00Z',
    created_at: '2026-08-15T09:12:00Z',
  },
  {
    id: 'user_creator_sophia',
    email: 'sophia.chen@genmotion.studio',
    name: 'Sophia Chen',
    role: 'creator',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    is_digilocker_verified: true,
    digilocker_aadhaar_ref: 'DL_REF_SHA256_b3389a01f5',
    digilocker_verified_at: '2026-08-25T11:45:00Z',
    created_at: '2026-08-18T10:00:00Z',
  },
  {
    id: 'user_creator_marcus',
    email: 'marcus.vance@cinemavox.ai',
    name: 'Marcus Vance',
    role: 'creator',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    is_digilocker_verified: true,
    digilocker_aadhaar_ref: 'DL_REF_SHA256_77fa33c2e1',
    digilocker_verified_at: '2026-09-02T16:10:00Z',
    created_at: '2026-08-29T12:00:00Z',
  },
  {
    id: 'user_admin',
    email: 'admin@cream.market',
    name: 'CREAM Trust & Safety Council',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    is_digilocker_verified: true,
    digilocker_aadhaar_ref: 'DL_REF_SHA256_admin_master',
    digilocker_verified_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  }
];

const INITIAL_SEED_CREATORS: CreatorProfile[] = [
  {
    id: 'cp_arjun',
    user_id: 'user_creator_arjun',
    display_name: 'Arjun Mehta',
    tagline: 'Lead AI Cinematographer & ComfyUI Pipeline Architect',
    bio: 'Specialist in hyperrealistic narrative video commercials, bespoke LoRA style training, and temporal consistency pipelines for global luxury brands.',
    tools: ['Runway Gen-2', 'Midjourney v6', 'ComfyUI', 'Flux.1', 'ElevenLabs', 'Stable Video Diffusion'],
    workflows: ['Custom LoRA Training', 'ControlNet Depth Guidance', 'AnimateDiff Interpolation', '4K ESRGAN Upscaling'],
    specializations: ['Photorealistic Commercials', 'Automotive Cinematics', 'Fashion Lookbooks'],
    hourly_rate: 6500,
    min_project_budget: 45000,
    rating: 4.96,
    completed_projects: 38,
    verified_badges: ['DigiLocker KYC', 'ComfyUI Master', 'SynthID Verified', 'Tier-1 Agency Approved'],
    portfolio_items: [
      {
        id: 'port_1',
        title: 'Aurora Hypercar 2026 Launch Film',
        thumbnail_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
        media_type: 'video',
        tools_used: ['Runway Gen-2', 'ComfyUI', 'Flux.1'],
        workflow_description: 'AnimateDiff motion flow with bespoke vehicle texture LoRA and photorealistic reflective lighting passes.',
        prompt_snippet: 'Cinematic wide angle, hypercar gliding along rain-slicked neon Tokyo highway, volumetric reflections, 8k, anamorphic lens 35mm',
        verified_render: true,
      },
      {
        id: 'port_2',
        title: 'Vogue Generative Haute Couture',
        thumbnail_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
        media_type: 'video',
        tools_used: ['Midjourney v6', 'Stable Video Diffusion'],
        workflow_description: 'Silk drape simulation via ControlNet edge maps and high-fidelity facial expression retention.',
        prompt_snippet: 'Avant-garde metallic fabric flowing around ethereal model, high fashion studio lighting, muted pastel grading',
        verified_render: true,
      }
    ],
    created_at: '2026-08-15T09:30:00Z'
  },
  {
    id: 'cp_sophia',
    user_id: 'user_creator_sophia',
    display_name: 'Sophia Chen',
    tagline: 'Generative 3D & Anime Art Director',
    bio: 'Creates stylized 3D commercials, character-driven brand stories, and mixed-media generative visualizer loops for gaming and music studios.',
    tools: ['Midjourney v6', 'ComfyUI', 'Kling AI', 'ElevenLabs', 'Blender Generative Nodes'],
    workflows: ['Character Consistency Sheets', 'IP-Adapter Pose Transfer', 'Multi-camera Spatial Loops'],
    specializations: ['Stylized 3D Animation', 'Character Worldbuilding', 'Music Visualizers'],
    hourly_rate: 5500,
    min_project_budget: 35000,
    rating: 4.92,
    completed_projects: 29,
    verified_badges: ['DigiLocker KYC', 'Character Consistency Pro', 'SynthID Verified'],
    portfolio_items: [
      {
        id: 'port_3',
        title: 'Neo-Tokyo Cyberpunk Brand Anthem',
        thumbnail_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
        media_type: 'video',
        tools_used: ['Kling AI', 'Midjourney v6', 'ComfyUI'],
        workflow_description: 'Keyframe consistency through IP-Adapter face weight tuning and animated depth map sequencing.',
        prompt_snippet: 'Retro-futuristic anime protagonist traversing holographic skyline, vibrant chromatic aberration, Studio Ghibli meets Akira aesthetic',
        verified_render: true,
      }
    ],
    created_at: '2026-08-18T10:15:00Z'
  },
  {
    id: 'cp_marcus',
    user_id: 'user_creator_marcus',
    display_name: 'Marcus Vance',
    tagline: 'Photorealistic Architectural & Product Visualizer',
    bio: 'Expert in generative industrial product rendering, luxury real estate cinematics, and complex optical lighting simulations with zero hallucination.',
    tools: ['Midjourney v6', 'Flux.1', 'ComfyUI', 'Magnific AI', 'Runway Gen-2'],
    workflows: ['Exact Scale ControlNet', 'Material Texture LoRA', 'High-res Inpainting Passes'],
    specializations: ['Architectural Visualizations', 'Product Launch Promos', 'Tech Hardware Teasers'],
    hourly_rate: 7000,
    min_project_budget: 50000,
    rating: 4.98,
    completed_projects: 42,
    verified_badges: ['DigiLocker KYC', 'SynthID Verified', 'Enterprise Verified'],
    portfolio_items: [
      {
        id: 'port_4',
        title: 'Zenith Spatial Audio Headset Promo',
        thumbnail_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        media_type: 'video',
        tools_used: ['Flux.1', 'ComfyUI', 'Runway Gen-2'],
        workflow_description: 'Titanium and acoustic mesh macro texturing with studio strobe light sweeps.',
        prompt_snippet: 'Macro commercial studio shot of precision milled dark titanium headphones, studio dark rim light, ultra crisp 8k texture',
        verified_render: true,
      }
    ],
    created_at: '2026-08-29T12:30:00Z'
  }
];

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading cream_db.json, re-initializing seed:', e);
    }
  }

  const defaultDb: DatabaseSchema = {
    users: INITIAL_SEED_USERS,
    creator_profiles: INITIAL_SEED_CREATORS,
    briefs: [],
    virtual_contracts: [],
    escrow_transactions: [],
    sample_renders: [],
    dispute_cases: [],
    negotiation_messages: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
  return defaultDb;
}

class Database {
  private getDb(): DatabaseSchema {
    return initDatabase();
  }

  private saveDb(db: DatabaseSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  }

  // Users
  getUsers(): User[] {
    return this.getDb().users;
  }

  getUserById(id: string): User | undefined {
    return this.getDb().users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  upsertUser(user: User): User {
    const db = this.getDb();
    const idx = db.users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      db.users[idx] = { ...db.users[idx], ...user };
    } else {
      db.users.push(user);
    }
    this.saveDb(db);
    return user;
  }

  updateDigiLockerStatus(userId: string, ref: string): User | undefined {
    const db = this.getDb();
    const user = db.users.find((u) => u.id === userId);
    if (user) {
      user.is_digilocker_verified = true;
      user.digilocker_aadhaar_ref = ref;
      user.digilocker_verified_at = new Date().toISOString();
      this.saveDb(db);
    }
    return user;
  }

  // Creators
  getCreators(): CreatorProfile[] {
    return this.getDb().creator_profiles;
  }

  getCreatorById(id: string): CreatorProfile | undefined {
    return this.getDb().creator_profiles.find((c) => c.id === id || c.user_id === id);
  }

  searchCreators(params: {
    query?: string;
    tool?: string;
    specialization?: string;
    maxBudget?: number;
    minRating?: number;
  }): { creators: CreatorProfile[]; matchScoreMap: Record<string, number> } {
    const creators = this.getCreators();
    const { query, tool, specialization, maxBudget, minRating } = params;

    const qLower = (query || '').toLowerCase().trim();
    const toolLower = (tool || '').toLowerCase().trim();
    const specLower = (specialization || '').toLowerCase().trim();

    const scored = creators.map((creator) => {
      let score = 10; // base score

      // Tool matching
      if (toolLower) {
        const matchesTool = creator.tools.some((t) => t.toLowerCase().includes(toolLower));
        if (matchesTool) score += 30;
      }

      // Specialization matching
      if (specLower) {
        const matchesSpec = creator.specializations.some((s) => s.toLowerCase().includes(specLower));
        if (matchesSpec) score += 25;
      }

      // Query semantic & keyword matching
      if (qLower) {
        const fullContent = `${creator.display_name} ${creator.tagline} ${creator.bio} ${creator.tools.join(' ')} ${creator.workflows.join(' ')} ${creator.specializations.join(' ')}`.toLowerCase();
        const keywords = qLower.split(/\s+/).filter(Boolean);
        for (const kw of keywords) {
          if (fullContent.includes(kw)) {
            score += 15;
          }
        }
      }

      // Rating boost
      score += Math.round(creator.rating * 5);

      // Verified badges boost
      if (creator.verified_badges.includes('DigiLocker KYC')) score += 10;
      if (creator.verified_badges.includes('SynthID Verified')) score += 5;

      // Budget filter check
      let matchesBudget = true;
      if (maxBudget && creator.min_project_budget > maxBudget) {
        matchesBudget = false;
      }

      // Rating filter check
      let matchesRating = true;
      if (minRating && creator.rating < minRating) {
        matchesRating = false;
      }

      return {
        creator,
        score,
        isValid: matchesBudget && matchesRating,
      };
    });

    const filtered = scored.filter((item) => item.isValid);
    filtered.sort((a, b) => b.score - a.score);

    const matchScoreMap: Record<string, number> = {};
    for (const item of filtered) {
      matchScoreMap[item.creator.id] = Math.min(99, Math.round((item.score / 120) * 100));
    }

    return {
      creators: filtered.map((item) => item.creator),
      matchScoreMap,
    };
  }

  // Briefs
  getBriefs(): BriefStructured[] {
    return this.getDb().briefs;
  }

  getBriefById(id: string): BriefStructured | undefined {
    return this.getDb().briefs.find((b) => b.id === id);
  }

  createBrief(brief: BriefStructured): BriefStructured {
    const db = this.getDb();
    db.briefs.unshift(brief);
    this.saveDb(db);
    return brief;
  }

  // Virtual Contracts
  getContracts(): VirtualContract[] {
    return this.getDb().virtual_contracts;
  }

  getContractById(id: string): VirtualContract | undefined {
    return this.getDb().virtual_contracts.find((c) => c.id === id);
  }

  createContract(contract: VirtualContract): VirtualContract {
    const db = this.getDb();
    db.virtual_contracts.unshift(contract);
    this.saveDb(db);
    return contract;
  }

  updateContract(id: string, updates: Partial<VirtualContract>): VirtualContract | undefined {
    const db = this.getDb();
    const idx = db.virtual_contracts.findIndex((c) => c.id === id);
    if (idx >= 0) {
      db.virtual_contracts[idx] = { ...db.virtual_contracts[idx], ...updates };
      this.saveDb(db);
      return db.virtual_contracts[idx];
    }
    return undefined;
  }

  // Escrow Transactions
  getEscrowTransactions(): EscrowTransaction[] {
    return this.getDb().escrow_transactions;
  }

  getEscrowByContractId(contractId: string): EscrowTransaction | undefined {
    return this.getDb().escrow_transactions.find((e) => e.contract_id === contractId);
  }

  createEscrowTransaction(tx: EscrowTransaction): EscrowTransaction {
    const db = this.getDb();
    db.escrow_transactions.unshift(tx);
    this.saveDb(db);
    return tx;
  }

  updateEscrowTransaction(id: string, updates: Partial<EscrowTransaction>): EscrowTransaction | undefined {
    const db = this.getDb();
    const idx = db.escrow_transactions.findIndex((e) => e.id === id);
    if (idx >= 0) {
      db.escrow_transactions[idx] = { ...db.escrow_transactions[idx], ...updates };
      this.saveDb(db);
      return db.escrow_transactions[idx];
    }
    return undefined;
  }

  // Sample Renders
  getSamplesByContract(contractId: string): SampleRender[] {
    return this.getDb().sample_renders.filter((s) => s.contract_id === contractId);
  }

  createSampleRender(sample: SampleRender): SampleRender {
    const db = this.getDb();
    db.sample_renders.unshift(sample);
    this.saveDb(db);
    return sample;
  }

  updateSampleRender(id: string, updates: Partial<SampleRender>): SampleRender | undefined {
    const db = this.getDb();
    const idx = db.sample_renders.findIndex((s) => s.id === id);
    if (idx >= 0) {
      db.sample_renders[idx] = { ...db.sample_renders[idx], ...updates };
      this.saveDb(db);
      return db.sample_renders[idx];
    }
    return undefined;
  }

  // Disputes
  getDisputes(): DisputeCase[] {
    return this.getDb().dispute_cases;
  }

  getDisputeByContractId(contractId: string): DisputeCase | undefined {
    return this.getDb().dispute_cases.find((d) => d.contract_id === contractId);
  }

  createDisputeCase(dispute: DisputeCase): DisputeCase {
    const db = this.getDb();
    db.dispute_cases.unshift(dispute);
    this.saveDb(db);
    return dispute;
  }

  updateDisputeCase(id: string, updates: Partial<DisputeCase>): DisputeCase | undefined {
    const db = this.getDb();
    const idx = db.dispute_cases.findIndex((d) => d.id === id);
    if (idx >= 0) {
      db.dispute_cases[idx] = { ...db.dispute_cases[idx], ...updates };
      this.saveDb(db);
      return db.dispute_cases[idx];
    }
    return undefined;
  }

  // Negotiation Messages
  getMessagesByContract(contractId: string): NegotiationMessage[] {
    return this.getDb().negotiation_messages.filter((m) => m.contract_id === contractId);
  }

  addNegotiationMessage(msg: NegotiationMessage): NegotiationMessage {
    const db = this.getDb();
    db.negotiation_messages.push(msg);
    this.saveDb(db);
    return msg;
  }
}

export const db = new Database();

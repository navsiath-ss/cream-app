import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { applyDualWatermarkToAsset } from '@/lib/watermark';
import { SampleRender } from '@/lib/types';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    let contractId = '';
    let creatorId = '';
    let file: File | null = null;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      contractId = formData.get('contractId') as string;
      creatorId = formData.get('creatorId') as string;
      file = formData.get('file') as File | null;
    } else {
      const jsonBody = await req.json().catch(() => ({}));
      contractId = jsonBody.contractId || '';
      creatorId = jsonBody.creatorId || '';
    }

    if (!contractId || !creatorId) {
      return NextResponse.json({ error: 'Missing contractId or creatorId' }, { status: 400 });
    }

    const contract = db.getContractById(contractId);
    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const creator = db.getUserById(creatorId);
    const creatorName = creator?.name || 'Top-tier AI Creator';

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let inputPath = '';
    const now = Date.now();

    if (file && typeof file.arrayBuffer === 'function') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = `raw_render_${now}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      inputPath = path.join(uploadsDir, safeName);
      fs.writeFileSync(inputPath, buffer);
    } else {
      // Create a high-res default sample render canvas if preset or no file passed
      const sampleName = `raw_render_${now}.png`;
      inputPath = path.join(uploadsDir, sampleName);
      
      // Copy a baseline demo asset from sample images
      const seedImgPath = path.join(process.cwd(), 'scripts', 'sample_base.png');
      if (fs.existsSync(seedImgPath)) {
        fs.copyFileSync(seedImgPath, inputPath);
      } else {
        // Generate an initial blank image via Python if needed
        fs.writeFileSync(inputPath, Buffer.from('CREAM_MEDIA_DUMMY_PNG'));
      }
    }

    // Execute Dual Watermarking Pipeline (Visible Overlay + SynthID Steganography)
    const watermarkResult = await applyDualWatermarkToAsset({
      inputPath,
      creatorName,
      creatorId,
      contractId,
    });

    const existingSamples = db.getSamplesByContract(contractId);
    const revisionNumber = existingSamples.length + 1;

    const newSample: SampleRender = {
      id: `smp_${now}`,
      contract_id: contractId,
      creator_id: creatorId,
      original_url: watermarkResult.originalRelativeUrl,
      watermarked_url: watermarkResult.watermarkedRelativeUrl,
      synthid_payload: watermarkResult.synthidPayload,
      status: 'pending_review',
      revision_number: revisionNumber,
      submitted_at: new Date().toISOString(),
    };

    db.createSampleRender(newSample);

    // Update contract status to sample_review
    const updatedContract = db.updateContract(contractId, {
      status: 'sample_review',
    });

    return NextResponse.json({
      sample: newSample,
      contract: updatedContract,
      message: 'Dual-layer watermarked sample preview processed and submitted for client review!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

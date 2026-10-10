import { NextRequest, NextResponse } from 'next/server';
import { verifyAssetSteganography } from '@/lib/watermark';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const { imageRelativeUrl } = await req.json();

    if (!imageRelativeUrl) {
      return NextResponse.json({ error: 'Missing imageRelativeUrl' }, { status: 400 });
    }

    const cleanPath = imageRelativeUrl.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'public', cleanPath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File does not exist on server' }, { status: 404 });
    }

    const result = await verifyAssetSteganography(fullPath);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

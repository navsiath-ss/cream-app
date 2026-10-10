"""
CREAM Dual-Layer Watermarking & Steganography Engine
Implements:
1. Visible Watermark Overlay (Branded header, diagonal escrow barrier, corner badges)
2. Invisible Steganographic SynthID Watermark (Embedded in PNG metadata & central pixel LSBs)
"""

import sys
import os
import json
import hashlib
import time
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin

SYNTHID_HEADER_MAGIC = "CREAM_SYNTHID_v1::"

def string_to_bits(s: str) -> list[int]:
    result = []
    for char in s.encode('utf-8'):
        bits = bin(char)[2:].zfill(8)
        result.extend([int(b) for b in bits])
    return result

def bits_to_string(bits: list[int]) -> str:
    chars = []
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        if len(byte) < 8:
            break
        char_code = int("".join(str(b) for b in byte), 2)
        chars.append(char_code)
    try:
        return bytes(chars).decode('utf-8', errors='ignore')
    except Exception:
        return ""

def apply_visible_watermark(image: Image.Image, creator_name: str, contract_id: str) -> Image.Image:
    """Draws security overlays, diagonal banners, and verification markings."""
    base = image.convert('RGBA')
    overlay = Image.new('RGBA', base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    width, height = base.size

    try:
        font_large = ImageFont.truetype("arial.ttf", max(18, int(width / 24)))
        font_small = ImageFont.truetype("arial.ttf", max(12, int(width / 40)))
    except Exception:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Diagonal watermark striping
    banner_text = f"CREAM ESCROW PROTECTED // CREATOR: {creator_name.upper()} // CONTRACT #{contract_id[:8]}"
    step = max(80, int(height / 4))
    for offset_y in range(step // 2, height - 50, step):
        draw.text((width // 10, offset_y), banner_text, fill=(255, 255, 255, 60), font=font_large)

    # Top banner bar
    draw.rectangle([(0, 0), (width, 36)], fill=(15, 17, 23, 190))
    draw.text((16, 8), "CREAM // CONFIDENTIAL CLIENT SAMPLE PREVIEW - NOT FOR PRODUCTION", fill=(212, 175, 55, 240), font=font_small)

    # Bottom status bar
    draw.rectangle([(0, height - 36), (width, height)], fill=(15, 17, 23, 190))
    draw.text((16, height - 28), f"Protected by SynthID Steganography • Escrow Pending Release • ID: {contract_id}", fill=(200, 200, 200, 220), font=font_small)

    return Image.alpha_composite(base, overlay)

def embed_steganography_safe(image: Image.Image, payload_dict: dict) -> Image.Image:
    """Embeds into central rows LSB where no headers/footers overwrite."""
    encoded_str = SYNTHID_HEADER_MAGIC + json.dumps(payload_dict) + "::END"
    bits = string_to_bits(encoded_str)
    
    img = image.copy()
    width, height = img.size
    pixels = img.load()
    
    start_y = 50
    end_y = height - 50
    bit_idx = 0
    total_bits = len(bits)
    
    for y in range(start_y, end_y):
        for x in range(width):
            if bit_idx >= total_bits:
                break
            r, g, b, a = pixels[x, y]
            if bit_idx < total_bits:
                r = (r & ~1) | bits[bit_idx]
                bit_idx += 1
            if bit_idx < total_bits:
                g = (g & ~1) | bits[bit_idx]
                bit_idx += 1
            if bit_idx < total_bits:
                b = (b & ~1) | bits[bit_idx]
                bit_idx += 1
            pixels[x, y] = (r, g, b, a)
        if bit_idx >= total_bits:
            break
            
    return img

def extract_steganography(image_path: str) -> dict | None:
    """Extracts and verifies embedded SynthID payload from an image."""
    img = Image.open(image_path)
    
    # Check PNG info metadata first
    if hasattr(img, 'info') and 'CREAM_SYNTHID' in img.info:
        try:
            return json.loads(img.info['CREAM_SYNTHID'])
        except Exception:
            pass

    # Inspect central pixel LSBs
    img_rgba = img.convert('RGBA')
    width, height = img_rgba.size
    pixels = img_rgba.load()
    
    extracted_bits = []
    max_bits = min(12000, width * (height - 100) * 3)
    start_y = 50
    end_y = height - 50
    
    for y in range(start_y, end_y):
        for x in range(width):
            if len(extracted_bits) >= max_bits:
                break
            r, g, b, _ = pixels[x, y]
            extracted_bits.append(r & 1)
            if len(extracted_bits) < max_bits:
                extracted_bits.append(g & 1)
            if len(extracted_bits) < max_bits:
                extracted_bits.append(b & 1)
        if len(extracted_bits) >= max_bits:
            break
            
    raw_str = bits_to_string(extracted_bits)
    if SYNTHID_HEADER_MAGIC in raw_str and "::END" in raw_str:
        start = raw_str.find(SYNTHID_HEADER_MAGIC) + len(SYNTHID_HEADER_MAGIC)
        end = raw_str.find("::END", start)
        payload_raw = raw_str[start:end]
        try:
            return json.loads(payload_raw)
        except Exception:
            return None
    return None

def process_sample_render(input_path: str, output_path: str, creator_name: str, creator_id: str, contract_id: str) -> dict:
    original = Image.open(input_path)
    
    with open(input_path, 'rb') as f:
        file_sha256 = hashlib.sha256(f.read()).hexdigest()

    payload = {
        "platform": "CREAM",
        "synthid_version": "1.0-alpha",
        "creator_name": creator_name,
        "creator_id": creator_id,
        "contract_id": contract_id,
        "asset_sha256": file_sha256,
        "timestamp_unix": int(time.time()),
        "status": "SAMPLE_WATERMARKED_ESCROW_GATE"
    }

    # Step 1: Visible Overlay
    vis_img = apply_visible_watermark(original, creator_name, contract_id)

    # Step 2: Steganography LSB
    final_img = embed_steganography_safe(vis_img, payload)

    # Step 3: PNG Metadata tag
    pnginfo = PngImagePlugin.PngInfo()
    pnginfo.add_text("CREAM_SYNTHID", json.dumps(payload))

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    final_img.save(output_path, "PNG", pnginfo=pnginfo)
    
    return {
        "status": "success",
        "output_path": output_path,
        "payload": payload
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: watermark_engine.py [process|verify] ...")
        sys.exit(1)
        
    action = sys.argv[1]
    if action == "process":
        in_path = sys.argv[2]
        out_path = sys.argv[3]
        c_name = sys.argv[4] if len(sys.argv) > 4 else "AI Creator"
        c_id = sys.argv[5] if len(sys.argv) > 5 else "c_123"
        cnt_id = sys.argv[6] if len(sys.argv) > 6 else "cnt_456"
        res = process_sample_render(in_path, out_path, c_name, c_id, cnt_id)
        print(json.dumps(res))
    elif action == "verify":
        target_path = sys.argv[2]
        extracted = extract_steganography(target_path)
        if extracted:
            print(json.dumps({"verified": True, "payload": extracted}))
        else:
            print(json.dumps({"verified": False, "error": "No SynthID watermark detected"}))

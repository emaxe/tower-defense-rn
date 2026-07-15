#!/usr/bin/env python3
"""
Full sprite processing pipeline for Tower Defense:
1. Remove chroma-key (#00FF00) background
2. Trim to content bounding box
3. Add padding
4. Resize to target square with transparent fill, centered, aspect-preserved

Usage: python process-sprite.py <input.png> [--output path] [--pad 10] [--size 256]
"""

import argparse
import os
from PIL import Image, ImageFilter

TARGET_COLOR = (0, 255, 0)


def remove_chroma(img: Image.Image, target: tuple = TARGET_COLOR, tolerance: int = 30, smooth: int = 1) -> Image.Image:
    img = img.convert("RGBA")
    data = list(img.getdata())
    tr, tg, tb = target
    new_data = []
    
    for item in data:
        r, g, b, a = item
        dist = ((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2) ** 0.5
        if dist < tolerance:
            alpha = 0
        elif dist < tolerance * 2:
            ratio = (dist - tolerance) / tolerance
            alpha = int(255 * ratio)
        else:
            alpha = 255
        new_data.append((r, g, b, alpha))
    
    img.putdata(new_data)
    
    if smooth > 0:
        r, g, b, a = img.split()
        a = a.filter(ImageFilter.GaussianBlur(radius=smooth))
        img = Image.merge("RGBA", (r, g, b, a))
    
    return img


def trim_and_resize(img: Image.Image, target_size: int = 256, padding: int = 10) -> Image.Image:
    """Trim transparent edges, add padding, center-fit into target_size square."""
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    
    if not bbox:
        print("  WARNING: Image is fully transparent after bg removal!")
        return Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    
    img = img.crop(bbox)
    
    content_w, content_h = img.size
    max_content = target_size - (padding * 2)
    
    scale = min(max_content / content_w, max_content / content_h)
    new_w = int(content_w * scale)
    new_h = int(content_h * scale)
    
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    final = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    x = (target_size - new_w) // 2
    y = (target_size - new_h) // 2
    final.paste(img, (x, y), img)
    
    return final


def process_file(input_path: str, output_path: str = None, tolerance: int = 30, smooth: int = 1, pad: int = 10, size: int = 256):
    img = Image.open(input_path)
    print(f"Input: {input_path} ({img.size[0]}x{img.size[1]})")
    
    img = remove_chroma(img, target=TARGET_COLOR, tolerance=tolerance, smooth=smooth)
    print(f"  → Background removed")
    
    img = trim_and_resize(img, target_size=size, padding=pad)
    print(f"  → Trimmed & resized to {size}x{size}")
    
    out = output_path or input_path
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    img.save(out)
    print(f"  → Saved: {out}")
    return out


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process AI sprite: remove chroma bg, trim, resize to square")
    parser.add_argument("input", help="Input PNG file")
    parser.add_argument("--output", "-o", help="Output path (default: overwrite input)")
    parser.add_argument("--tolerance", type=int, default=30, help="Chroma key tolerance")
    parser.add_argument("--smooth", type=int, default=1, help="Alpha feathering")
    parser.add_argument("--pad", type=int, default=10, help="Padding pixels around content")
    parser.add_argument("--size", type=int, default=256, help="Target square size")
    args = parser.parse_args()
    
    process_file(args.input, args.output, args.tolerance, args.smooth, args.pad, args.size)

#!/usr/bin/env python3
"""Convert all AI-generated and real project images to optimized WebP."""
from PIL import Image
import os

projects_dir = "/home/z/my-project/public/projects"

# New AI-generated and real images to convert
new_images = [
    # AI-generated images (PNG)
    "githunguri-ai-1.png",
    "githunguri-ai-2.png",
    "githunguri-ai-3.png",
    "pcea-ai-1.png",
    "pcea-ai-2.png",
    "pcea-ai-3.png",
    "kamau-ai-1.png",
    "kamau-ai-2.png",
    "kamau-ai-3.png",
    "naiwear-ai-1.png",
    "naiwear-ai-2.png",
    "diaspora-ai-1.png",
    "diaspora-ai-2.png",
    "dtf-printing-1.png",
    "dtf-printing-2.png",
    # Real moenviron images
    "moenviron-real-4.jpg",
    "moenviron-hero.png",
    "moenviron-mid.png",
    "moenviron-screenshot.png",
    "moenviron-og.webp",  # Already webp but needs resize
]

max_width = 1200
quality = 80

for img_name in new_images:
    img_path = os.path.join(projects_dir, img_name)
    if not os.path.exists(img_path):
        print(f"SKIP: {img_name} not found")
        continue

    try:
        img = Image.open(img_path)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)

        # Output WebP path
        base_name = os.path.splitext(img_name)[0]
        webp_path = os.path.join(projects_dir, f"{base_name}.webp")

        img.save(webp_path, "WEBP", quality=quality, method=6)

        original_size = os.path.getsize(img_path)
        webp_size = os.path.getsize(webp_path)
        savings = round((1 - webp_size / original_size) * 100, 1)

        print(f"OK: {img_name} -> {base_name}.webp ({original_size//1024}KB -> {webp_size//1024}KB, -{savings}%)")

        # Remove original
        os.remove(img_path)

    except Exception as e:
        print(f"ERROR: {img_name} - {e}")

# Also remove old stock images that we're replacing
old_to_remove = [
    "githunguri-1.webp", "githunguri-2.webp", "githunguri-3.webp", "githunguri-4.webp",
    "pcea-1.webp", "pcea-2.webp", "pcea-3.webp", "pcea-4.webp",
    "kamau-1.webp", "kamau-2.webp", "kamau-3.webp", "kamau-4.webp",
    "naiwear-1.webp", "naiwear-2.webp", "naiwear-3.webp",
    "diaspora-1.webp", "diaspora-2.webp", "diaspora-3.webp",
    "moenviron-0.webp", "moenviron-1.webp", "moenviron-2.webp", "moenviron-3.webp",
]

for old in old_to_remove:
    old_path = os.path.join(projects_dir, old)
    if os.path.exists(old_path):
        os.remove(old_path)
        print(f"REMOVED old: {old}")

print("\nDone! Final project images:")
for f in sorted(os.listdir(projects_dir)):
    if f.endswith(".webp"):
        size = os.path.getsize(os.path.join(projects_dir, f))
        print(f"  {f}: {size//1024}KB")

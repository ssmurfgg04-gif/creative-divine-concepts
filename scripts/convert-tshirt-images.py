#!/usr/bin/env python3
"""Convert new T-shirt product images and moenviron screenshots to WebP."""
from PIL import Image
import os

projects_dir = "/home/z/my-project/public/projects"

new_images = [
    # T-shirt product shots (no people)
    "tshirt-school-1.png",
    "tshirt-school-2.png",
    "tshirt-school-3.png",
    "tshirt-church-1.png",
    "tshirt-church-2.png",
    "tshirt-church-3.png",
    "tshirt-brand-1.png",
    "tshirt-brand-2.png",
    # Moenviron screenshots
    "moenviron-homepage-fresh.png",
    "moenviron-products.png",
    "moenviron-story.png",
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

        base_name = os.path.splitext(img_name)[0]
        webp_path = os.path.join(projects_dir, f"{base_name}.webp")

        img.save(webp_path, "WEBP", quality=quality, method=6)

        original_size = os.path.getsize(img_path)
        webp_size = os.path.getsize(webp_path)
        savings = round((1 - webp_size / original_size) * 100, 1)

        print(f"OK: {img_name} -> {base_name}.webp ({original_size//1024}KB -> {webp_size//1024}KB, -{savings}%)")
        os.remove(img_path)
    except Exception as e:
        print(f"ERROR: {img_name} - {e}")

# Remove old AI people images
old_to_remove = [
    "githunguri-ai-1.webp", "githunguri-ai-2.webp", "githunguri-ai-3.webp",
    "pcea-ai-1.webp", "pcea-ai-2.webp", "pcea-ai-3.webp",
    "naiwear-ai-1.webp", "naiwear-ai-2.webp",
    "moenviron-screenshot.webp", "moenviron-hero.webp", "moenviron-mid.webp",
    "moenviron-og.webp",
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

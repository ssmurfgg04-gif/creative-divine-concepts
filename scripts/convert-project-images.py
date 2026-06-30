#!/usr/bin/env python3
"""Convert and optimize project images to WebP format."""
from PIL import Image
import os
import sys

projects_dir = "/home/z/my-project/public/projects"

# Mapping of new images to convert
new_images = [
    "githunguri-1-new.jpg",
    "githunguri-2-new.jpg",
    "githunguri-3-new.jpg",
    "githunguri-4-new.jpg",
    "pcea-1-new.jpg",
    "pcea-2-new.jpg",
    "pcea-3-new.jpg",
    "pcea-4-new.jpg",
    "kamau-1-new.jpg",
    "kamau-2-new.jpg",
    "kamau-3-new.jpg",
    "kamau-4-new.jpg",
]

max_width = 1200  # Max width for web
quality = 82  # WebP quality (good balance of size/quality)

for img_name in new_images:
    img_path = os.path.join(projects_dir, img_name)
    if not os.path.exists(img_path):
        print(f"SKIP: {img_name} not found")
        continue

    try:
        img = Image.open(img_path)
        # Convert RGBA to RGB for WebP (avoids issues)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Resize if wider than max_width
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)

        # Output WebP path (remove -new suffix)
        base_name = img_name.replace("-new.jpg", "")
        webp_path = os.path.join(projects_dir, f"{base_name}.webp")

        # Save as WebP
        img.save(webp_path, "WEBP", quality=quality, method=6)

        original_size = os.path.getsize(img_path)
        webp_size = os.path.getsize(webp_path)
        savings = round((1 - webp_size / original_size) * 100, 1)

        print(f"OK: {img_name} -> {base_name}.webp ({original_size//1024}KB -> {webp_size//1024}KB, -{savings}%)")

        # Remove the original JPG
        os.remove(img_path)

    except Exception as e:
        print(f"ERROR: {img_name} - {e}")

print("\nDone! All images converted to WebP.")

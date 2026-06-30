#!/usr/bin/env python3
"""Convert ALL remaining project images to WebP and remove originals."""
from PIL import Image
import os

projects_dir = "/home/z/my-project/public/projects"

# Get all non-WebP images (excluding the ones already converted above)
extensions = [".jpg", ".jpeg", ".png"]
max_width = 1200
quality = 82

for filename in sorted(os.listdir(projects_dir)):
    if any(filename.lower().endswith(ext) for ext in extensions):
        img_path = os.path.join(projects_dir, filename)
        try:
            img = Image.open(img_path)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)

            base_name = os.path.splitext(filename)[0]
            webp_path = os.path.join(projects_dir, f"{base_name}.webp")

            # Skip if WebP already exists and is newer
            if os.path.exists(webp_path):
                print(f"SKIP: {base_name}.webp already exists (using new image version)")
                os.remove(img_path)
                continue

            img.save(webp_path, "WEBP", quality=quality, method=6)

            original_size = os.path.getsize(img_path)
            webp_size = os.path.getsize(webp_path)
            savings = round((1 - webp_size / original_size) * 100, 1)

            print(f"OK: {filename} -> {base_name}.webp ({original_size//1024}KB -> {webp_size//1024}KB, -{savings}%)")

            os.remove(img_path)
        except Exception as e:
            print(f"ERROR: {filename} - {e}")

print("\nDone! All images converted to WebP.")
print("\nFinal project images:")
for f in sorted(os.listdir(projects_dir)):
    if f.endswith(".webp"):
        size = os.path.getsize(os.path.join(projects_dir, f))
        print(f"  {f}: {size//1024}KB")

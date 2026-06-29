#!/usr/bin/env python3
"""Generate a proper OG image (1200x630 PNG) for Creative Divine Concepts."""
from PIL import Image, ImageDraw, ImageFont
import os

# 1200x630 is the standard OG image size
WIDTH, HEIGHT = 1200, 630

# CDC brand colors
CREAM = (245, 233, 215)  # hsl(38 30% 90%)
ORANGE = (243, 106, 33)  # #f36a21
CRIMSON = (117, 31, 42)  # hsl(351 74% 29%)
DARK = (64, 64, 64)  # hsl(0 0% 25%)
WHITE = (255, 255, 255)

# Create image with cream background
img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
draw = ImageDraw.Draw(img)

# Try to load fonts
font_paths = [
    "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf",
    "/usr/share/fonts/truetype/chinese/NotoSansSC-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]

def load_font(size):
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

# Draw decorative orange band on left
draw.rectangle([0, 0, 12, HEIGHT], fill=ORANGE)

# Draw decorative circle (top right)
circle_radius = 180
circle_x = WIDTH - 150
circle_y = 120
draw.ellipse(
    [
        circle_x - circle_radius, circle_y - circle_radius,
        circle_x + circle_radius, circle_y + circle_radius
    ],
    fill=ORANGE,
    outline=None,
)

# Draw smaller crimson circle
small_radius = 80
draw.ellipse(
    [
        circle_x - small_radius - 100, circle_y + 80 - small_radius,
        circle_x - small_radius - 100 + small_radius * 2, circle_y + 80 + small_radius
    ],
    fill=CRIMSON,
    outline=None,
)

# Draw text
title_font = load_font(64)
subtitle_font = load_font(32)
small_font = load_font(20)

# Title
title = "Web Design, Branding"
title2 = "& DTF Printing in Kenya"
draw.text((80, 180), title, fill=DARK, font=title_font)
draw.text((80, 260), title2, fill=DARK, font=title_font)

# Orange accent line
draw.rectangle([80, 360, 200, 366], fill=ORANGE)

# Subtitle
subtitle = "From first sketch to final print."
draw.text((80, 400), subtitle, fill=CRIMSON, font=subtitle_font)

subtitle2 = "Built in Kiambu. Serving Nairobi, Mombasa, diaspora & beyond."
draw.text((80, 450), subtitle2, fill=DARK, font=small_font)

# Footer
footer = "creativedivineconcepts.com"
draw.text((80, 560), footer, fill=ORANGE, font=small_font)

# Stats badges
stats = [
    ("200+", "Projects"),
    ("50+", "Clients"),
    ("19", "Free Tools"),
    ("4.9", "Rating"),
]
badge_x = 700
badge_y = 480
badge_w = 110
badge_h = 80
for i, (value, label) in enumerate(stats):
    x = badge_x + i * (badge_w + 10)
    # Background
    draw.rounded_rectangle(
        [x, badge_y, x + badge_w, badge_y + badge_h],
        radius=8,
        fill=WHITE,
        outline=ORANGE,
        width=2,
    )
    # Value
    draw.text((x + 25, badge_y + 12), value, fill=ORANGE, font=load_font(24))
    # Label
    draw.text((x + 20, badge_y + 45), label, fill=DARK, font=load_font(14))

# Save
output_path = "/home/z/my-project/public/og-image.png"
img.save(output_path, "PNG", optimize=True)
print(f"OG image saved to {output_path}")
print(f"Size: {os.path.getsize(output_path)} bytes")

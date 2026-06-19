#!/usr/bin/env python3
"""Recolor the TDN medallion logo to purple & gold.
Replaces the wood-grain brown background with deep plum while preserving
the gold rim, monogram, silhouette and text. Makes the outside transparent.
Outputs a web-ready ~360px transparent PNG.
"""
from PIL import Image

SRC = "assets/images/Logo/IMG_7267.PNG"
OUT = "assets/images/logo-tdn.png"

img = Image.open(SRC).convert("RGBA")
# Square-ish; scale down for the web (logo shows at <=120px)
TARGET = 360
img.thumbnail((TARGET, TARGET), Image.LANCZOS)
px = list(img.getdata())

# Plum base for recolored wood (deep plum -> plum-soft range)
P = (74, 35, 79)        # --plum
P_DEEP = (54, 23, 58)   # --plum-deep

out = []
for r, g, b, a in px:
    mx, mn = max(r, g, b), min(r, g, b)
    # 1) Transparent near-white exterior (low saturation + bright)
    if mn > 226 and (mx - mn) < 26:
        out.append((255, 255, 255, 0))
        continue
    # 2) Gold elements: yellow-ish (red & green high, blue notably lower) -> keep
    yellowness = ((r + g) / 2) - b
    if r > 105 and g > 78 and b < g * 0.86 and yellowness > 26:
        # keep gold, gently enrich
        out.append((min(255, int(r * 1.04)), min(255, int(g * 1.02)), b, a))
        continue
    # 3) Everything else (brown wood, grout lines, shadows) -> textured plum
    lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0  # 0..1
    t = max(0.0, min(1.0, (lum - 0.06) / 0.62))         # normalize wood range
    scale = 0.62 + t * 0.85                              # darker grain -> lighter plum
    nr = int(P[0] * scale + 6)
    ng = int(P[1] * scale)
    nb = int(P[2] * scale + 8)
    out.append((min(255, nr), min(255, ng), min(255, nb), a))

img.putdata(out)
img.save(OUT)
print("saved", OUT, img.size)

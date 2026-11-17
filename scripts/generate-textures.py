"""
Generates the tileable material textures used by the illustrated mattress
(exploded construction view and product renders).

    python3 scripts/generate-textures.py

Pure Pillow, deterministic (seeded) so output is reproducible.
Writes to public/textures/.
"""
import math
import os
import random

from PIL import Image, ImageChops, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "textures")
SIZE = 512


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def shade(rgb, f):
    return tuple(max(0, min(255, int(c * f))) for c in rgb)


def wrap_positions(x, y, r, size=SIZE):
    """Yield the position plus wrapped copies so drawing tiles seamlessly."""
    xs = [x] + ([x - size] if x + r > size else []) + ([x + size] if x - r < 0 else [])
    ys = [y] + ([y - size] if y + r > size else []) + ([y + size] if y - r < 0 else [])
    for px in xs:
        for py in ys:
            yield px, py


def mottle(base, strength, blobs, rng, radius=(30, 90)):
    """Soft low-frequency tonal variation, tileable."""
    img = Image.new("RGB", (SIZE, SIZE), base)
    layer = Image.new("L", (SIZE, SIZE), 128)
    d = ImageDraw.Draw(layer)
    for _ in range(blobs):
        x, y = rng.uniform(0, SIZE), rng.uniform(0, SIZE)
        r = rng.uniform(*radius)
        v = 128 + rng.choice([-1, 1]) * rng.uniform(10, 40)
        for px, py in wrap_positions(x, y, r):
            d.ellipse([px - r, py - r, px + r, py + r], fill=int(v))
    layer = tile_blur(layer, 28)
    light = Image.new("RGB", (SIZE, SIZE), shade(base, 1 + strength))
    dark = Image.new("RGB", (SIZE, SIZE), shade(base, 1 - strength))
    img = Image.composite(light, dark, layer)
    return img


def tile_blur(img, radius):
    """Gaussian blur that wraps around edges (keeps the tile seamless)."""
    w, h = img.size
    big = Image.new(img.mode, (w * 3, h * 3))
    for i in range(3):
        for j in range(3):
            big.paste(img, (i * w, j * h))
    big = big.filter(ImageFilter.GaussianBlur(radius))
    return big.crop((w, h, 2 * w, 2 * h))


def grain(img, amount, rng_seed):
    random.seed(rng_seed)
    noise = Image.effect_noise((SIZE, SIZE), 40).convert("L")
    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(img, ImageChops.overlay(img, noise_rgb), amount)


def pores(img, count, rmin, rmax, dark, rim, rng, blur=0.45, squash=1.0):
    """Open-cell foam pores: a light lower rim and a darker cavity."""
    over = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for _ in range(count):
        x, y = rng.uniform(0, SIZE), rng.uniform(0, SIZE)
        r = rng.uniform(rmin, rmax) ** 1.0
        rx, ry = r * rng.uniform(0.75, 1.25), r * rng.uniform(0.7, 1.15) * squash
        a = int(rng.uniform(0.45, 1.0) * 255)
        for px, py in wrap_positions(x, y, r + 2):
            d.ellipse([px - rx + 0.6, py - ry + 0.9, px + rx + 0.6, py + ry + 0.9], fill=rim + (int(a * 0.55),))
            d.ellipse([px - rx, py - ry, px + rx, py + ry], fill=dark + (a,))
    over = over.filter(ImageFilter.GaussianBlur(blur))
    base = img.convert("RGBA")
    base.alpha_composite(over)
    return base.convert("RGB")


def foam_comfort():
    rng = random.Random(11)
    base = hex_rgb("#efe6d4")
    img = mottle(base, 0.035, 60, rng)
    img = pores(img, 9000, 0.5, 1.5, shade(base, 0.86), shade(base, 1.04), rng, blur=0.5)
    img = pores(img, 260, 1.6, 2.6, shade(base, 0.88), shade(base, 1.03), rng, blur=0.9)
    img = grain(img, 0.25, 3)
    img.save(os.path.join(OUT, "foam-comfort.jpg"), quality=86)


def foam_support():
    rng = random.Random(23)
    base = hex_rgb("#d9d1c3")
    img = mottle(base, 0.03, 50, rng)
    img = pores(img, 14000, 0.45, 1.2, shade(base, 0.82), shade(base, 1.04), rng, blur=0.35)
    img = grain(img, 0.3, 5)
    img.save(os.path.join(OUT, "foam-support.jpg"), quality=86)


def base_foam():
    rng = random.Random(37)
    base = hex_rgb("#77716a")
    img = mottle(base, 0.04, 50, rng)
    img = pores(img, 12000, 0.4, 1.0, shade(base, 0.8), shade(base, 1.07), rng, blur=0.35)
    img = grain(img, 0.3, 7)
    img.save(os.path.join(OUT, "foam-base.jpg"), quality=86)


def fibre():
    rng = random.Random(53)
    base = hex_rgb("#f3eee5")
    img = mottle(base, 0.04, 70, rng, radius=(20, 60)).convert("RGBA")
    for layer_i, (count, col, alpha, width) in enumerate(
        [(1400, "#d6ccbc", 120, 1), (2200, "#ffffff", 170, 1), (700, "#c9bfae", 90, 1)]
    ):
        over = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        d = ImageDraw.Draw(over)
        c = hex_rgb(col)
        for _ in range(count):
            x, y = rng.uniform(0, SIZE), rng.uniform(0, SIZE)
            length = rng.uniform(10, 46)
            ang = rng.gauss(0, 0.55)
            bend = rng.uniform(-0.04, 0.04)
            pts = []
            steps = 8
            for s in range(steps + 1):
                t = s / steps * length
                a = ang + bend * t
                pts.append((x + math.cos(a) * t, y + math.sin(a) * t))
            for dx in (-SIZE, 0, SIZE):
                for dy in (-SIZE, 0, SIZE):
                    d.line([(px + dx, py + dy) for px, py in pts], fill=c + (int(alpha * rng.uniform(0.5, 1)),), width=width)
        over = over.filter(ImageFilter.GaussianBlur(0.5 if layer_i != 1 else 0.35))
        img.alpha_composite(over)
    img = grain(img.convert("RGB"), 0.25, 9)
    img.save(os.path.join(OUT, "fibre.jpg"), quality=86)


def nonwoven():
    """Spun-bond pocket fabric: fine, randomly laid filaments."""
    rng = random.Random(71)
    base = hex_rgb("#f1efea")
    img = mottle(base, 0.03, 40, rng).convert("RGBA")
    over = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for _ in range(5200):
        x, y = rng.uniform(0, SIZE), rng.uniform(0, SIZE)
        length = rng.uniform(3, 12)
        a = rng.uniform(0, math.pi)
        x2, y2 = x + math.cos(a) * length, y + math.sin(a) * length
        col = (255, 255, 255, 110) if rng.random() < 0.6 else (214, 209, 200, 70)
        for dx in (-SIZE, 0, SIZE):
            for dy in (-SIZE, 0, SIZE):
                d.line([(x + dx, y + dy), (x2 + dx, y2 + dy)], fill=col, width=1)
    over = over.filter(ImageFilter.GaussianBlur(0.4))
    img.alpha_composite(over)
    img = grain(img.convert("RGB"), 0.3, 11)
    img.save(os.path.join(OUT, "nonwoven.jpg"), quality=86)


def knit():
    """Fine knitted mattress ticking: rows of interlocking V stitches."""
    rng = random.Random(97)
    base = hex_rgb("#f6f2ea")
    img = mottle(base, 0.02, 40, rng).convert("RGBA")
    over = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    cw, rh = 8, 7  # 64 columns x ~73 rows -> SIZE must divide evenly by cw
    rows = SIZE // rh
    rh = SIZE / rows
    for r in range(rows):
        for c in range(SIZE // cw):
            x = c * cw + cw / 2
            y = r * rh
            j = rng.uniform(-0.35, 0.35)
            for side in (-1, 1):
                # each stitch leg: a slanted oval with a shadow beneath
                cx, cy = x + side * cw * 0.24, y + rh * 0.55
                pts = []
                for k in range(16):
                    t = k / 16 * 2 * math.pi
                    ex, ey = math.cos(t) * cw * 0.2, math.sin(t) * rh * 0.62
                    a = side * -0.55
                    pts.append((cx + ex * math.cos(a) - ey * math.sin(a) + j, cy + ex * math.sin(a) + ey * math.cos(a)))
                d.polygon([(px, py + 0.9) for px, py in pts], fill=(196, 188, 174, 120))
                d.polygon(pts, fill=(255, 255, 255, 150))
    over = over.filter(ImageFilter.GaussianBlur(0.55))
    img.alpha_composite(over)
    img = grain(img.convert("RGB"), 0.2, 13)
    img.save(os.path.join(OUT, "knit.jpg"), quality=88)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    foam_comfort()
    foam_support()
    base_foam()
    fibre()
    nonwoven()
    knit()
    print("textures written to", os.path.abspath(OUT))

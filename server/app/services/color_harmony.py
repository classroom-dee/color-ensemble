from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

HarmonyType = Literal[
    'complementary',
    'analogous',
    'triadic',
    'split_complementary',
]


@dataclass(frozen=True)
class ColorFormats:
    """Canonical representation of a color in multiple formats."""

    hex: str  # '#rrggbb'
    rgb: tuple[int, int, int]  # 0-255
    hsl: tuple[float, float, float]  # (h:0-360, s:0-1, l:0-1)
    hsv: tuple[float, float, float]  # (h:0-360, s:0-1, v:0-1)


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def _mod_hue(h: float) -> float:
    # keep in [0, 360)
    h = h % 360.0
    if h < 0:
        h += 360.0
    return h


def parse_hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    s = hex_str.strip()
    if s.startswith('#'):
        s = s[1:]
    if len(s) == 3:
        s = ''.join(ch * 2 for ch in s)
    if len(s) != 6:
        raise ValueError('HEX must be 3 or 6 hex digits (optionally prefixed with #)')
    try:
        r = int(s[0:2], 16)
        g = int(s[2:4], 16)
        b = int(s[4:6], 16)
    except ValueError as e:
        raise ValueError('Invalid HEX digits') from e
    return r, g, b


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    r, g, b = rgb
    if not all(isinstance(x, int) for x in (r, g, b)):
        raise ValueError('RGB must be integers 0-255')
    if not all(0 <= x <= 255 for x in (r, g, b)):
        raise ValueError('RGB values must be in 0-255')
    return f'#{r:02x}{g:02x}{b:02x}'


def rgb_to_hsl(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
    r, g, b = (c / 255.0 for c in rgb)
    mx = max(r, g, b)
    mn = min(r, g, b)
    d = mx - mn

    l = (mx + mn) / 2.0
    if d == 0:
        h = 0.0
        s = 0.0
    else:
        s = d / (1.0 - abs(2.0 * l - 1.0))
        if mx == r:
            h = 60.0 * (((g - b) / d) % 6.0)
        elif mx == g:
            h = 60.0 * (((b - r) / d) + 2.0)
        else:
            h = 60.0 * (((r - g) / d) + 4.0)
    return _mod_hue(h), _clamp(s, 0.0, 1.0), _clamp(l, 0.0, 1.0)


def _hue_to_rgb(p: float, q: float, t: float) -> float:
    t = t % 1.0
    if t < 1 / 6:
        return p + (q - p) * 6 * t
    if t < 1 / 2:
        return q
    if t < 2 / 3:
        return p + (q - p) * (2 / 3 - t) * 6
    return p


def hsl_to_rgb(hsl: tuple[float, float, float]) -> tuple[int, int, int]:
    h, s, l = hsl
    h = _mod_hue(h) / 360.0
    s = _clamp(s, 0.0, 1.0)
    l = _clamp(l, 0.0, 1.0)

    if s == 0.0:
        r = g = b = l
    else:
        q = l + s - l * s if l >= 0.5 else l * (1 + s)
        p = 2 * l - q
        r = _hue_to_rgb(p, q, h + 1 / 3)
        g = _hue_to_rgb(p, q, h)
        b = _hue_to_rgb(p, q, h - 1 / 3)

    return (int(round(r * 255)), int(round(g * 255)), int(round(b * 255)))


def rgb_to_hsv(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
    r, g, b = (c / 255.0 for c in rgb)
    mx = max(r, g, b)
    mn = min(r, g, b)
    d = mx - mn

    v = mx
    if d == 0:
        h = 0.0
        s = 0.0
    else:
        s = d / mx if mx != 0 else 0.0
        if mx == r:
            h = 60.0 * (((g - b) / d) % 6.0)
        elif mx == g:
            h = 60.0 * (((b - r) / d) + 2.0)
        else:
            h = 60.0 * (((r - g) / d) + 4.0)
    return _mod_hue(h), _clamp(s, 0.0, 1.0), _clamp(v, 0.0, 1.0)


def hsv_to_rgb(hsv: tuple[float, float, float]) -> tuple[int, int, int]:
    h, s, v = hsv
    h = _mod_hue(h)
    s = _clamp(s, 0.0, 1.0)
    v = _clamp(v, 0.0, 1.0)

    c = v * s
    x = c * (1 - abs(((h / 60.0) % 2) - 1))
    m = v - c

    if 0 <= h < 60:
        rp, gp, bp = c, x, 0
    elif 60 <= h < 120:
        rp, gp, bp = x, c, 0
    elif 120 <= h < 180:
        rp, gp, bp = 0, c, x
    elif 180 <= h < 240:
        rp, gp, bp = 0, x, c
    elif 240 <= h < 300:
        rp, gp, bp = x, 0, c
    else:
        rp, gp, bp = c, 0, x

    r = int(round((rp + m) * 255))
    g = int(round((gp + m) * 255))
    b = int(round((bp + m) * 255))
    return r, g, b


def normalize_color(
    *,
    hex: str | None = None,
    rgb: tuple[int, int, int] | None = None,
    hsl: tuple[float, float, float] | None = None,
    hsv: tuple[float, float, float] | None = None,
) -> ColorFormats:
    """Normalize any supported input format into a canonical multi-format value.

    Exactly one of (hex, rgb, hsl, hsv) must be provided.
    """
    provided = [hex is not None, rgb is not None, hsl is not None, hsv is not None]
    if sum(provided) != 1:
        raise ValueError('Provide exactly one of hex, rgb, hsl, hsv')

    if hex is not None:
        rgb_val = parse_hex_to_rgb(hex)
    elif rgb is not None:
        rgb_val = rgb
    elif hsl is not None:
        rgb_val = hsl_to_rgb(hsl)
    else:
        rgb_val = hsv_to_rgb(hsv)  # type: ignore[arg-type]

    hex_val = rgb_to_hex(rgb_val)
    hsl_val = rgb_to_hsl(rgb_val)
    hsv_val = rgb_to_hsv(rgb_val)
    return ColorFormats(hex=hex_val, rgb=rgb_val, hsl=hsl_val, hsv=hsv_val)


def _shift_hue_in_hsl(base: ColorFormats, delta: float) -> ColorFormats:
    h, s, l = base.hsl
    new_hsl = (_mod_hue(h + delta), s, l)
    rgb_val = hsl_to_rgb(new_hsl)
    return normalize_color(rgb=rgb_val)


def generate_harmonies(base: ColorFormats) -> dict[HarmonyType, list[ColorFormats]]:
    """Return the 4 requested harmonies as lists of colors (excluding the base)."""
    return {
        'complementary': [_shift_hue_in_hsl(base, 180.0)],
        'analogous': [_shift_hue_in_hsl(base, -30.0), _shift_hue_in_hsl(base, 30.0)],
        'triadic': [_shift_hue_in_hsl(base, -120.0), _shift_hue_in_hsl(base, 120.0)],
        'split_complementary': [
            _shift_hue_in_hsl(base, 150.0),
            _shift_hue_in_hsl(base, 210.0),
        ],
    }

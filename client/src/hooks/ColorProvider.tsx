import { useState } from "react";
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from "./colorUtils";
import type { RGB, HSL } from "./colorUtils";
import { ColorContext } from "./useColor";

const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [hex, setHexState] = useState("#ff0000");

  const isValidHex = /^#?[0-9a-fA-F]{6}$/.test(hex);
  const rgb = isValidHex ? hexToRgb(hex) : { r: 0, g: 0, b: 0 };
  const hsl = isValidHex ? rgbToHsl(rgb) : { h: 0, s: 0, l: 0 };

  const setHex = (value: string) => {
    if (!/^#?[0-9a-fA-F]{0,6}$/.test(value)) return;
    setHexState(value.startsWith("#") ? value : `#${value}`);
  };

  const setRgb = (value: RGB) => {
    setHexState(rgbToHex(value));
  };

  const setHsl = (nextHsl: HSL) => {
    const clamped = {
      h: ((nextHsl.h % 360) + 360) % 360,
      s: Math.min(Math.max(nextHsl.s, 0), 100),
      l: Math.min(Math.max(nextHsl.l, 0), 100),
    };

    const nextRgb = hslToRgb(clamped.h, clamped.s, clamped.l);
    const nextHex = rgbToHex(nextRgb);

    setHexState(nextHex);
  };

  return (
    <ColorContext.Provider value={{ hex, rgb, hsl, setHex, setRgb, setHsl }}>
      {children}
    </ColorContext.Provider>
  );
};

export default ColorProvider;

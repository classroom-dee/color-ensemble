import { useState } from "react";

import { useColor } from "../../hooks/useColor";
import { hslToRgb, rgbToHex, rotateHue } from "../../hooks/colorUtils";
import { useFavorite } from "../../hooks/useFavorite";
import { useAuth } from "../../hooks/useAuth";

import { ensembles, type HarmonyType } from "../../types/color";

import "./EnsemblesPanel.css";

export default function EnsemblesPanel() {
  const { hex, hsl, setHsl } = useColor();
  const { addFavoriteHarmony } = useFavorite();
  const { user, token } = useAuth();
  const [status, setStatus] = useState<string | null>(null);

  const onAddFavHarm = async (hex: string, harmony_type: HarmonyType) => {
    if (!token) return;
    const ok = await addFavoriteHarmony(hex, harmony_type);
    setStatus(
      ok ? "Added to favorite harmonies" : "Failed to add favorite harmonies",
    );
  };

  return (
    <div className="ensemble-output">
      {ensembles.map((ensemble) => (
        <div key={ensemble.name} className="ensemble">
          <h4>{ensemble.name}</h4>

          <div className="swatches">
            {ensemble.hues.map((delta) => {
              const hue = rotateHue(hsl.h, delta);
              const color = {
                h: hue,
                s: hsl.s,
                l: hsl.l,
              };

              const rgb = hslToRgb(color.h, color.s, color.l);
              const _hex = rgbToHex(rgb);

              return (
                <div
                  key={delta}
                  className="swatch clickable"
                  onClick={() => setHsl(color)}
                >
                  <div className="color" style={{ backgroundColor: _hex }}>
                    <span className="hex">{_hex}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {user ? (
            <div className="favorites">
              <button onClick={() => onAddFavHarm(hex, ensemble.name)}>
                Add to favorites
              </button>
              {status && <span className="status">{status}</span>}
            </div>
          ) : (
            <span className="hint">Sign in to save favorites</span>
          )}
        </div>
      ))}
    </div>
  );
}

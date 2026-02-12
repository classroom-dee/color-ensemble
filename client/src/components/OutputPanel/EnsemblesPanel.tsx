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

  const [statusByEns, setStatusByEns] = useState<Record<string, string | null>>(
    {},
  );

  const onAddFavHarm = async (hex: string, harmony_type: HarmonyType) => {
    if (!token) return;
    const ok = await addFavoriteHarmony(hex, harmony_type);
    setStatusByEns((prev) => ({
      ...prev,
      [harmony_type]: ok ? "Added to favorite harmonies" : "Failed to add",
    }));
    setTimeout(() => {
      setStatusByEns((prev) => ({
        ...prev,
        [harmony_type]: null,
      }));
    }, 3000);
  };

  return (
    <div className="card flex-fill">
      <div className="card-header py-1 px-2 small fw-semibold">
        Color Ensembles
      </div>

      <div className="card-body p-2 overflow-auto">
        <div className="d-flex flex-column gap-3">
          {ensembles.map((ensemble) => (
            <div key={ensemble.name}>
              {/* Ensemble Header */}
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-semibold">{ensemble.name}</span>

                {user ? (
                  statusByEns[ensemble.name] && (
                    <span className="text-info small">
                      {statusByEns[ensemble.name]}
                    </span>
                  )
                ) : (
                  <span className="text-warning small">
                    Sign in to save favorites
                  </span>
                )}
              </div>

              {/* Swatches */}
              <div className="d-flex flex-wrap gap-1">
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
                      className="ensemble-swatch"
                      style={{
                        backgroundColor: _hex,
                      }}
                      onClick={() => {
                        setHsl(color);
                        if (user) {
                          onAddFavHarm(hex, ensemble.name);
                        }
                      }}
                    >
                      <span className="plus">+</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

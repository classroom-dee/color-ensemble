import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useColor } from "../hooks/useColor";
import { useFavorite } from "../hooks/useFavorite";

export default function ColorInputs() {
  const { user, token } = useAuth();
  const { hex, rgb, hsl, setHex, setRgb, setHsl } = useColor();
  const [status, setStatus] = useState<string | null>(null);
  const { addFavorite } = useFavorite();

  /* ---------- helpers ---------- */

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const onHexChange = (value: string) => {
    setStatus(null);
    setHex(value);
  };

  const onRgbChange = (channel: "r" | "g" | "b", value: string) => {
    setStatus(null);
    const next = clamp(Number(value) || 0, 0, 255);
    setRgb({ ...rgb, [channel]: next });
  };

  const onHslChange = (channel: "h" | "s" | "l", value: string) => {
    setStatus(null);
    const num = Number(value);
    if (Number.isNaN(num)) return;
    const next = {
      ...hsl,
      [channel]: channel === "h" ? clamp(num, 0, 360) : clamp(num, 0, 100),
    };
    setHsl(next);
  };

  const onAddFavorite = async () => {
    if (!token) return;
    const ok = await addFavorite(hex);
    setStatus(ok ? "Added to favorites" : "Failed to add favorite");
    setTimeout(() => {
      setStatus("");
    }, 3000);
  };

  /* ---------- render ---------- */

  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="row g-3 align-items-end">
          {/* HEX */}
          <div className="col-auto">
            <label className="form-label small mb-1">HEX</label>
            <input
              className="form-control form-control-sm"
              value={hex}
              onChange={(e) => onHexChange(e.target.value)}
              placeholder="#ff0000"
            />
          </div>

          {/* RGB */}
          <div className="col-auto">
            <label className="form-label small mb-1">RGB</label>
            <div className="d-flex gap-1">
              {(["r", "g", "b"] as const).map((c) => (
                <input
                  key={c}
                  className="form-control form-control-sm text-center"
                  style={{ width: 56 }}
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[c]}
                  onChange={(e) => onRgbChange(c, e.target.value)}
                />
              ))}
            </div>
          </div>

          {/* HSL */}
          <div className="col-auto">
            <label className="form-label small mb-1">HSL</label>
            <div className="d-flex gap-1">
              {(["h", "s", "l"] as const).map((c) => (
                <input
                  key={c}
                  className="form-control form-control-sm text-center"
                  style={{ width: 56 }}
                  type="number"
                  min={0}
                  max={c === "h" ? 360 : 100}
                  value={hsl[c]}
                  onChange={(e) => onHslChange(c, e.target.value)}
                />
              ))}
            </div>
          </div>

          <div className="col-auto">
            {user ? (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={onAddFavorite}
                >
                  Add
                </button>
                {status && (
                  <div
                    className={`text-${status[0] === "A" ? "success" : "danger"} small mt-1`}
                  >
                    {status}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-warning small">
                Sign in to save favorites
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

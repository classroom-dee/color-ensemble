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
  };

  /* ---------- render ---------- */

  return (
    <div className="color-inputs">
      {/* HEX */}
      <div className="input-group">
        <label>HEX</label>
        <input
          value={hex}
          onChange={(e) => onHexChange(e.target.value)}
          placeholder="#ff0000"
        />
      </div>

      {/* RGB */}
      <div className="input-group">
        <label>RGB</label>
        <div className="row">
          <input
            type="number"
            min={0}
            max={255}
            value={rgb.r}
            onChange={(e) => onRgbChange("r", e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={255}
            value={rgb.g}
            onChange={(e) => onRgbChange("g", e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={255}
            value={rgb.b}
            onChange={(e) => onRgbChange("b", e.target.value)}
          />
        </div>
      </div>

      {/* HSL */}
      <div className="input-group">
        <label>HSL</label>
        <div className="row">
          <input
            type="number"
            min={0}
            max={360}
            value={hsl.h}
            onChange={(e) => onHslChange("h", e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={hsl.s}
            onChange={(e) => onHslChange("s", e.target.value)}
          />
          <input
            type="number"
            min={0}
            max={100}
            value={hsl.l}
            onChange={(e) => onHslChange("l", e.target.value)}
          />
        </div>
      </div>

      {user ? (
        <div className="favorites">
          <button onClick={onAddFavorite}>Add to favorites</button>
          {status && <span className="status">{status}</span>}
        </div>
      ) : (
        <span className="hint">Sign in to save favorites</span>
      )}
    </div>
  );
}

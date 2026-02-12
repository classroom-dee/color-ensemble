import { HslColorPicker } from "react-colorful";
import { useColor } from "../hooks/useColor";

export default function ColorWheel() {
  const { hsl, setHsl } = useColor();

  return (
    <div className="card h-100">
      <div className="card-header py-1 px-2 small fw-semibold">
        Color Picker
      </div>

      <div className="card-body d-flex align-items-center justify-content-center p-2">
        <div className="d-flex flex-column align-items-center gap-2">
          <HslColorPicker color={hsl} onChange={setHsl} />
          <span className="text-muted small">
            Drag to adjust hue, saturation, and lightness
          </span>
        </div>
      </div>
    </div>
  );
}

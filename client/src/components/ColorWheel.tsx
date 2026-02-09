import { HslColorPicker } from "react-colorful";
import { useColor } from "../hooks/useColor";

export default function ColorWheel() {
  const { hsl, setHsl } = useColor();

  return (
    <div className="palette-wheel">
      {/* Tabs */}
      <div className="title">
        <p>Pick a color!</p>
      </div>

      {/* Wheels */}
      <div className="wheel">
        <HslColorPicker color={hsl} onChange={setHsl} />
      </div>
    </div>
  );
}

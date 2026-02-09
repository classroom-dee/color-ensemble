import { useColor } from "../../hooks/useColor";
import { hslToRgb, rgbToHex, rotateHue } from "../../hooks/colorUtils";
import "./EnsemblesPanel.css";

type Ensemble = {
  name: string;
  hues: number[];
};

export default function EnsemblesPanel() {
  const { hsl, setHsl } = useColor();

  const ensembles: Ensemble[] = [
    {
      name: "Complementary",
      hues: [0, 180],
    },
    {
      name: "Analogous",
      hues: [-30, 0, 30],
    },
    {
      name: "Triadic",
      hues: [0, 120, 240],
    },
    {
      name: "Split-Complementary",
      hues: [0, 150, 210],
    },
  ];

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
              const hex = rgbToHex(rgb);

              return (
                <div
                  key={delta}
                  className="swatch clickable"
                  onClick={() => setHsl(color)}
                >
                  <div className="color" style={{ backgroundColor: hex }}>
                    <span className="hex">{hex}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

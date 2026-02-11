import { useAuth } from "../../hooks/useAuth";
import { useColor } from "../../hooks/useColor";
import { useFavorite } from "../../hooks/useFavorite";
import { ensembles } from "../../types/color";
import {
  rotateHue,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
} from "../../hooks/colorUtils";

export default function FavHarmoniesPanel() {
  const { token } = useAuth();
  const { setHsl } = useColor();
  const { favHarmLoading, favHarmonies, deleteFavoriteHarmony } = useFavorite();

  const onDelete = async (id: number) => {
    if (!token) return;

    try {
      deleteFavoriteHarmony(id);
    } catch (err) {
      throw new Error(`${err}`); // not this. use alert component
    }
  };

  if (favHarmLoading) return <p>Loading favorite harmonies…</p>;

  if (!favHarmonies.length) return <p>No favorites yet. Add some colors!</p>;

  return (
    <div className="ensemble-output" style={{ flex: 1, overflowY: "auto" }}>
      {favHarmonies.map((fh) => (
        <div key={fh.id} className="ensemble">
          <h4>{fh.harmony_type}</h4>
          <div className="swatches">
            {ensembles
              .filter((ens) => ens.name == fh.harmony_type)?.[0]
              .hues.map((delta) => {
                const hsl = rgbToHsl(hexToRgb(fh.base_hex));
                const hue = rotateHue(hsl.h, delta);
                const color = {
                  h: hue,
                  s: hsl.s,
                  l: hsl.l,
                };
                const newHex = rgbToHex(hslToRgb(color.h, color.s, color.l));

                return (
                  <div
                    key={delta}
                    className="swatch clickable"
                    onClick={() => setHsl(color)}
                  >
                    <div className="color" style={{ backgroundColor: newHex }}>
                      <span className="hex">{newHex}</span>
                      <button
                        className="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(fh.id);
                        }}
                      ></button>
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

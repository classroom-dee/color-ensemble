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
    <div className="card flex-fill">
      <div className="card-header py-1 px-2 small fw-semibold">
        Favorite Harmonies
      </div>

      <div className="card-body p-2 overflow-auto">
        {favHarmLoading && <div className="small text-muted">Loading…</div>}

        {!favHarmLoading && !favHarmonies.length && (
          <div className="small text-muted">No harmonies yet</div>
        )}

        <div className="d-flex flex-column gap-3">
          {favHarmonies.map((fh) => (
            <div key={fh.id}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-semibold">{fh.harmony_type}</span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(fh.id);
                  }}
                >
                  Delete
                </button>
              </div>
              <div className="d-flex gap-1 flex-wrap">
                {ensembles
                  .find((ens) => ens.name == fh.harmony_type)!
                  .hues.map((delta) => {
                    const hsl = rgbToHsl(hexToRgb(fh.base_hex));
                    const hue = rotateHue(hsl.h, delta);
                    const color = {
                      h: hue,
                      s: hsl.s,
                      l: hsl.l,
                    };
                    const newHex = rgbToHex(
                      hslToRgb(color.h, color.s, color.l),
                    );

                    return (
                      <div
                        key={delta}
                        className="rounded border"
                        style={{
                          width: 48,
                          height: 48,
                          backgroundColor: newHex,
                          cursor: "pointer",
                        }}
                        onClick={() => setHsl(color)}
                        title={newHex}
                      />
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

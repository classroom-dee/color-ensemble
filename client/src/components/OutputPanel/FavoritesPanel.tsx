import { useAuth } from "../../hooks/useAuth";
import { useColor } from "../../hooks/useColor";
import { useFavorite } from "../../hooks/useFavorite";

import "./FavoritesPanel.css";

export default function FavoritesPanel() {
  const { token } = useAuth();
  const { setHex } = useColor();
  const { favLoading, favorites, deleteFavorite } = useFavorite();

  const onDelete = async (id: number) => {
    if (!token) return;

    try {
      deleteFavorite(id);
    } catch (err) {
      throw new Error(`${err}`); // not this. use alert component
    }
  };

  if (favLoading) return <p>Loading favorites…</p>;

  if (!favorites.length) return <p>No favorites yet. Add some colors!</p>;

  return (
    <div className="favorites-panel">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="swatch"
          style={{ backgroundColor: fav.hex }}
          onClick={() => setHex(fav.hex)}
          title="Set as base color"
        >
          <div className="swatch-footer">
            <span className="hex">{fav.hex}</span>
            <button
              className="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(fav.id);
              }}
              title="Remove from favorites"
            >
              ❌
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

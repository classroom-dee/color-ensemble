import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getFavorites, deleteFavorite } from "../../services/favorites";
import type { Favorite } from "../../services/favorites";
import { useColor } from "../../hooks/useColor";

import "./FavoritesPanel.css";

export default function FavoritesPanel({ added }: { added: boolean }) {
  const { token } = useAuth();
  const { setHex } = useColor();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    getFavorites(token)
      .then(setFavorites)
      .finally(() => setLoading(false));
  }, [token, setFavorites, added]);

  const onDelete = async (id: number) => {
    if (!token) return;

    // optimistic
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    try {
      await deleteFavorite(token, id);
    } catch {
      // rollback
      getFavorites(token).then(setFavorites);
    }
  };

  if (loading) return <p>Loading favorites…</p>;

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

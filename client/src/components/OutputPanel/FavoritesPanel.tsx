import { useAuth } from "../../hooks/useAuth";
import { useColor } from "../../hooks/useColor";
import { useFavorite } from "../../hooks/useFavorite";

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
    <div className="card flex-fill">
      <div className="card-header py-1 px-2 small fw-semibold">
        Favorite Colors
      </div>

      <div className="card-body p-2 overflow-auto">
        {favLoading && <div className="small text-muted">Loading...</div>}
        {!favLoading && !favorites.length && (
          <div className="small text-muted">No favorites yet</div>
        )}

        <div className="d-flex flex-wrap gap-2">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="position-relative rounded border"
              style={{
                backgroundColor: fav.hex,
                width: 64,
                height: 64,
                cursor: "pointer",
              }}
              onClick={() => setHex(fav.hex)}
              title="Set as base color"
            >
              <span className="position-absolute bottom-0 start-0 w-100 text-center small text-white bg-dark bg-opacity-50">
                {fav.hex}
              </span>
              <button
                className="btn btn-sm btn-danger position-absolute top-0 end-0 p-0"
                style={{ width: 20, height: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(fav.id);
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

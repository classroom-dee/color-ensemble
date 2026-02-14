import { useAuth } from "../hooks/useAuth";
import AuthPanel from "./AuthPanel";
import type { OutputMode } from "../types/state";

interface Props {
  mode: OutputMode;
  setMode: (m: OutputMode) => void;
}

export default function Navbar({ mode, setMode }: Props) {
  const { user, logout, loading } = useAuth();

  return (
    <div className="card">
      <div className="card-body py-2 px-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-light border"
            style={{
              width: 36,
              height: 36,
              fontSize: 18,
              userSelect: "none",
            }}
            title="Color Ensemble"
          >
            🎨
          </div>

          <div className="btn-group btn-group-sm">
            <button
              className={`btn btn-outline-primary ${mode === "ensembles" ? "active" : ""}`}
              onClick={() => setMode("ensembles")}
            >
              Ensembles
            </button>

            {user && (
              <button
                className={`btn btn-outline-primary ${mode === "favorites" ? "active" : ""}`}
                onClick={() => setMode("favorites")}
              >
                Favorites
              </button>
            )}
          </div>

          <div className="ms-auto d-flex align-items-center gap-2">
            {loading ? (
              <span className="text-muted small">Loading...</span>
            ) : user ? (
              <>
                <span className="text-primary small text-nowrap">
                  {user.email}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <AuthPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

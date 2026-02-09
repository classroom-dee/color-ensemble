import { useAuth } from "../hooks/useAuth";
import AuthPanel from "./AuthPanel";
import type { OutputMode } from "../types/state";

export default function Navbar({
  mode,
  setMode,
}: {
  mode: OutputMode;
  setMode: (m: OutputMode) => void;
}) {
  const { user, logout, loading } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 16,
      }}
    >
      {/* App icon / home */}
      <strong
        style={{
          cursor: "pointer",
          fontWeight: mode === "ensembles" ? "bold" : "normal",
        }}
        onClick={() => setMode("ensembles")}
      >
        🎨 Color Ensemble
      </strong>

      {user && (
        <strong
          onClick={() => setMode("favorites")}
          style={{
            cursor: "pointer",
            fontWeight: mode === "favorites" ? "bold" : "normal",
          }}
        >
          My Favorites
        </strong>
      )}

      <div style={{ marginLeft: "auto" }}>
        {loading ? null : user ? (
          <>
            <span style={{ marginRight: 8 }}>{user.email}</span>
            <button onClick={logout}>Sign out</button>
          </>
        ) : (
          <AuthPanel />
        )}
      </div>
    </nav>
  );
}

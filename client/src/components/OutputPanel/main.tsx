import FavoritesPanel from "./FavoritesPanel";
import EnsemblesPanel from "./EnsemblesPanel";
import FavHarmoniesPanel from "./FavHarmoniesPanel";
import type { OutputMode } from "../../types/state";

export default function OutputPanel({ mode }: { mode: OutputMode }) {
  if (mode === "favorites") {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <FavoritesPanel />;
        <FavHarmoniesPanel />
      </div>
    );
  }

  return <EnsemblesPanel />;
}

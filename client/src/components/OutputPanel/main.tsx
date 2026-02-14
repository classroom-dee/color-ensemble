import FavoritesPanel from "./FavoritesPanel";
import EnsemblesPanel from "./EnsemblesPanel";
import FavHarmoniesPanel from "./FavHarmoniesPanel";
import type { OutputMode } from "../../types/state";

interface Props {
  mode: OutputMode;
}

export default function OutputPanel({ mode }: Props) {
  return (
    <div className="card h-100">
      <div
        className="card-body p-2 d-flex flex-column gap-2"
        style={{ minHeight: 0 }}
      >
        {mode === "ensembles" && <EnsemblesPanel />}
        {mode === "favorites" && (
          <>
            <FavoritesPanel />
            <FavHarmoniesPanel />
          </>
        )}
      </div>
    </div>
  );
}

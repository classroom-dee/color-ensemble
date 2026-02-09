import FavoritesPanel from "./FavoritesPanel";
import EnsemblesPanel from "./EnsemblesPanel";
import type { OutputMode } from "../../types/state";

export default function OutputPanel({ mode }: { mode: OutputMode }) {
  if (mode === "favorites") {
    return <FavoritesPanel />;
  }

  return <EnsemblesPanel />;
}

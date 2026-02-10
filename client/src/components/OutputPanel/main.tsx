import FavoritesPanel from "./FavoritesPanel";
import EnsemblesPanel from "./EnsemblesPanel";
import type { OutputMode } from "../../types/state";

export default function OutputPanel({
  mode,
  added,
}: {
  mode: OutputMode;
  added: boolean;
}) {
  if (mode === "favorites") {
    return <FavoritesPanel added={added} />;
  }

  return <EnsemblesPanel />;
}

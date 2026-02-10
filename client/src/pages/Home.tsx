import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import ColorWheel from "../components/ColorWheel";
import OutputPanel from "../components/OutputPanel/main";
import ColorInputs from "../components/ColorInputs";

import type { OutputMode } from "../types/state";

import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const [mode, setMode] = useState<OutputMode>("ensembles");
  const [added, setAdded] = useState<boolean>(false); // it's just a toggle

  const effectiveMode: OutputMode =
    user && mode === "favorites" ? "favorites" : "ensembles";

  return (
    <div className="app-grid">
      <header className="nav">
        <Navbar mode={effectiveMode} setMode={setMode} />
      </header>

      <section className="middle-left">
        <ColorWheel />
      </section>

      <section className="middle-right">
        <OutputPanel mode={effectiveMode} added={added} />
      </section>

      <footer className="bottom">
        <ColorInputs setAdded={setAdded} added={added} />
      </footer>
    </div>
  );
}

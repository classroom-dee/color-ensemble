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

  const effectiveMode: OutputMode =
    user && mode === "favorites" ? "favorites" : "ensembles";

  return (
    <div className="container py-4">
      <div className="card shadow-sm app-card">
        <div className="card-body p-3">
          <div className="row g-3 mb-3">
            <div className="mb-3">
              <Navbar mode={effectiveMode} setMode={setMode} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <ColorWheel />
            </div>

            <div className="col-md-6">
              <OutputPanel mode={effectiveMode} />
            </div>
          </div>

          <div>
            <ColorInputs />
          </div>
        </div>
      </div>
    </div>
  );
}

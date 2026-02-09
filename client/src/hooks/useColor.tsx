import { useContext, createContext } from "react";
import type { ColorContextValue } from "./colorUtils";

export const ColorContext = createContext<ColorContextValue | null>(null);

export const useColor = () => {
  const ctx = useContext(ColorContext);
  if (!ctx) {
    throw new Error("useColor must be used inside ColorProvider");
  }
  return ctx;
};

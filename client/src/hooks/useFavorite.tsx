import { useContext, createContext } from "react";
import type { Favorite, FavoriteHarmony } from "../services/favorites";
import type { HarmonyType } from "../types/color";

interface FavoritesContextValue {
  favLoading: boolean;
  favHarmLoading: boolean;
  favorites: Favorite[];
  favHarmonies: FavoriteHarmony[];
  addFavorite: (hex: string) => Promise<boolean>;
  deleteFavorite: (id: number) => Promise<boolean>;
  addFavoriteHarmony: (
    hex: string,
    harmony_type: HarmonyType,
  ) => Promise<boolean>;
  deleteFavoriteHarmony: (id: number) => Promise<boolean>;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);

export const useFavorite = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorite must be used inside FavoritesProvider");
  }
  return ctx;
};

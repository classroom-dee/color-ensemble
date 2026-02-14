import { useState, useCallback, useEffect } from "react";
import { FavoritesContext } from "./useFavorite";

import type { HarmonyType } from "../types/color";
import type { FavoriteHarmony, Favorite } from "../services/favorites";
import { useAuth } from "./useAuth";

import {
  getFavorites,
  addFavorite as addFav,
  deleteFavorite as deleteFav,
  addFavoriteHarmony as addFavHarm,
  deleteFavoriteHarmony as deleteFavHarm,
  getFavoriteHarmonies,
} from "../services/favorites";

const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [favorites, setFavoritesState] = useState<Favorite[]>([]);
  const [favHarmonies, setFavHarmoniesState] = useState<FavoriteHarmony[]>([]);
  const [favLoading, setFavLoading] = useState(() => !!token);
  const [favHarmLoading, setFavharmLoading] = useState(() => !!token);

  useEffect(() => {
    if (!token) {
      return;
    }

    const getFavs = async () => {
      const favs = await getFavorites(token);
      setFavoritesState(favs);
      setFavLoading(false);
    };

    const getFavHarms = async () => {
      const favHarms = await getFavoriteHarmonies(token);
      setFavHarmoniesState(favHarms);
      setFavharmLoading(false);
    };

    getFavs();
    getFavHarms();
  }, [token]);

  // validation helpers
  const validateHex = (hex: string) => {
    return /^#?[0-9a-fA-F]{6}$/.test(hex);
  };

  // set state, call apis
  const addFavorite = useCallback(
    async (hex: string) => {
      if (!token) return false; // maybe upgrade later to message
      if (!validateHex(hex)) return false; // this too

      // dedupe
      if (favorites.some((f) => f.hex === hex)) {
        return false;
      }

      const newFav = await addFav(token, hex);
      setFavoritesState((prev) => [...prev, newFav]);
      return true;
    },
    [token, favorites],
  );

  const deleteFavorite = useCallback(
    async (id: number) => {
      if (!token) return false;
      try {
        await deleteFav(token, id);
        setFavoritesState((prev) => prev.filter((f) => f.id != id));
        return true;
      } catch {
        return false; // chain error message
      }
    },
    [token],
  );

  const compKey = (hex: string, h_type: HarmonyType) => `${hex}|${h_type}`;

  const addFavoriteHarmony = useCallback(
    async (hex: string, h_type: HarmonyType) => {
      if (!token) return false;
      if (!validateHex(hex)) return false; // this too

      if (
        favHarmonies.some(
          (fh) =>
            compKey(fh.base_hex, fh.harmony_type) === compKey(hex, h_type),
        )
      ) {
        return false;
      }
      const newFavHarm = await addFavHarm(token, hex, h_type);
      setFavHarmoniesState((prev) => [...prev, newFavHarm]);
      return true;
    },
    [token, favHarmonies],
  );

  const deleteFavoriteHarmony = useCallback(
    async (id: number) => {
      if (!token) return false;
      try {
        await deleteFavHarm(token, id);
        setFavHarmoniesState((prev) => prev.filter((fh) => fh.id != id));
        return true;
      } catch {
        return false;
      }
    },
    [token],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favLoading,
        favHarmLoading,
        favorites,
        favHarmonies,
        addFavorite,
        deleteFavorite,
        addFavoriteHarmony,
        deleteFavoriteHarmony,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;

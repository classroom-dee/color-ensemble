import { api } from "./api";
import type { HarmonyType } from "../types/color";

export interface Favorite {
  id: number;
  hex: string;
}

export interface FavoriteHarmony {
  id: number;
  base_hex: string;
  harmony_type: HarmonyType;
}

// -------------
// Fav Harmonies
// -------------
export async function addFavoriteHarmony(
  token: string,
  base_hex: string,
  harmony_type: HarmonyType,
) {
  const res = await api.post(
    "/favorites/harmonies",
    { base_hex, harmony_type },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data as FavoriteHarmony;
}

export async function getFavoriteHarmonies(token: string) {
  const res = await api.get("/favorites/harmonies", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as FavoriteHarmony[];
}

export async function deleteFavoriteHarmony(token: string, harmony_id: number) {
  const res = await fetch(`/api/favorites/harmonies/${harmony_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete favorite");
  }
}

// -------------
// Fav colors
// -------------
export async function addFavorite(token: string, hex: string) {
  const res = await api.post(
    "/favorites",
    { hex },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data as Favorite;
}

export async function getFavorites(token: string) {
  const res = await api.get("/favorites", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as Favorite[];
}

export async function deleteFavorite(token: string, id: number) {
  const res = await fetch(`/api/favorites/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete favorite");
  }
}

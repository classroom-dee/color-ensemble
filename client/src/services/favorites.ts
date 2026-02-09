import { api } from "./api";

export interface Favorite {
  id: number;
  hex: string;
}

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

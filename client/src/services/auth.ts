import { api } from "./api";

export interface User {
  id: number;
  email: string;
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data as { access_token: string };
}

export async function register(email: string, password: string) {
  await api.post("/auth/register", { email, password });
}

export async function fetchMe(token: string): Promise<User> {
  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

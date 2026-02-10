import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api",
  baseURL: import.meta.env.VITE_API_BASE ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

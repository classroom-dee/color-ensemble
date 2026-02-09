import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Authentication failed";
}

export default function AuthPanel() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return null;

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">{mode === "login" ? "Sign in" : "Sign up"}</button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        style={{
          background: "none",
          border: "none",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {mode === "login" ? "Sign up" : "Sign in"}
      </button>

      {error && <span style={{ color: "red" }}>{error}</span>}
    </form>
  );
}

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
      className="d-flex align-items-center gap-2 flex-nowrap"
    >
      <input
        className="form-control form-control-sm"
        style={{ width: 140 }}
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-control form-control-sm"
        style={{ width: 120 }}
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className={`btn btn-outline-${mode === "login" ? "warning" : "success"} text-nowrap`}
        style={{ minWidth: 72 }}
      >
        {mode === "login" ? "Sign in" : "Sign up"}
      </button>

      <button
        type="button"
        className={`btn btn-outline-${mode === "login" ? "success" : "warning"} text-nowrap`}
        style={{ minWidth: 72 }}
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Sign up" : "Sign in"}
      </button>

      {error && (
        <span className="text-danger small ms-1 text-nowrap">{error}</span>
      )}
    </form>
  );
}

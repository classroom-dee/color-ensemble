import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, afterEach } from "vitest";
import Navbar from "../../src/components/Navbar";
import { useAuth } from "../../src/hooks/useAuth";

vi.mock("../../src/hooks/useAuth");

const mockUseAuth = vi.mocked(useAuth);

describe("Auth UI", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("shows login form when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  test("shows user email and sign out when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: "test@example.com" },
      token: "fake-token",
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("login failure displays error", async () => {
    const login = vi.fn().mockRejectedValue(new Error("Invalid credentials"));

    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      loading: false,
      login,
      logout: vi.fn(),
    });

    render(<Navbar />);

    fireEvent.change(screen.getByPlaceholderText("email"), {
      target: { value: "bad@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByText("Sign in"));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  test("logout calls logout()", () => {
    const logout = vi.fn();

    mockUseAuth.mockReturnValue({
      user: { id: 1, email: "test@example.com" },
      token: "fake-token",
      loading: false,
      login: vi.fn(),
      logout,
    });

    render(<Navbar />);

    fireEvent.click(screen.getByText("Logout"));
    expect(logout).toHaveBeenCalled();
  });
});

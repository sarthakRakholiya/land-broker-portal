import { LoginFormData } from "@/schemas/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "broker" | "client";
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private readonly API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid credentials");
      }

      const data: AuthResponse = await response.json();

      console.log("=== Auth Service Login Success ===");
      console.log(
        "Received token:",
        data.token ? "Token received" : "No token in response"
      );
      console.log("Received user:", data.user);

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Verify storage immediately
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("user");
        console.log("Token stored successfully:", !!storedToken);
        console.log("User stored successfully:", !!storedUser);
        console.log(
          "Stored token preview:",
          storedToken?.substring(0, 50) + "..."
        );
      }

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window === "undefined") {
      console.log("getToken: Server side, returning null");
      return null;
    }

    const token = localStorage.getItem("auth_token");
    console.log(
      "getToken: Retrieved from localStorage:",
      token ? "Token exists" : "No token found"
    );

    if (token) {
      console.log("Token preview:", token.substring(0, 50) + "...");
    }

    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

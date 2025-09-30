import { authService } from "./auth";
import { toast } from "@/utils/toast";

// Global logout function - will be set by the auth context
let globalLogout: (() => Promise<void>) | null = null;

export const setGlobalLogout = (logoutFn: () => Promise<void>) => {
  globalLogout = logoutFn;
};

class ApiClient {
  private readonly API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

  private getAuthHeaders() {
    const token = authService.getToken();
    console.log(
      "API Client - Token retrieved:",
      token ? "Token exists" : "No token"
    );

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log("API Client - Headers:", {
      hasAuth: !!headers.Authorization,
      contentType: headers["Content-Type"],
    });

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle 401 Unauthorized or 403 Forbidden
    if (response.status === 401 || response.status === 403) {
      // Clear local storage
      await authService.logout();

      // Show logout message
      toast.error(
        "Session Expired",
        "Your session has expired. Please login again."
      );

      // Trigger global logout if available
      if (globalLogout) {
        await globalLogout();
      }

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new Error("Session expired");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, value.toString());
        }
      });
    }

    const url = `${this.API_BASE}${endpoint}${
      searchParams.toString() ? `?${searchParams}` : ""
    }`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();

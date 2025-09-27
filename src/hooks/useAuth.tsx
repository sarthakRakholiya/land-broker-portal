"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService, User } from "@/services/auth";
import { LoginFormData } from "@/schemas/auth";
import { toast } from "@/utils/toast";
import { setGlobalLogout } from "@/services/apiClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginFormData) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success("Success", t("auth.loginSuccess"));
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth.loginError");
      toast.error("Error", message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Success", t("auth.logoutSuccess"));
    } catch {
      toast.error("Error", "Logout failed. Please try again.");
    }
  }, [t]);

  // Register global logout function for API client
  useEffect(() => {
    setGlobalLogout(logout);
  }, [logout]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

"use client";

import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import { User, LoginCredentials } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
      setUser(currentUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        const res = await authService.login(credentials);
        const token = res?.token || res?.data?.token;
        const userData = res?.user || res?.data?.user;

        if (token) {
          localStorage.setItem("token", token);
          if (userData) localStorage.setItem("user", JSON.stringify(userData));
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

          setUser(userData || null);
          setIsAuthenticated(true);
        }
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/auth";
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}

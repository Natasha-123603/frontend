"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getAuthUser,
  setAuthUser,
  clearAuthUser,
} from "@/lib/auth";

export function useAuth() {
  // Initialize as null to prevent hydration mismatch
  // Will be set in useEffect after mount (client-side only)
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load - only runs on client
    const currentToken = getAuthToken();
    const currentUser = getAuthUser();
    setToken(currentToken);
    setUser(currentUser);
    setIsLoading(false);

    // Listen for storage changes (when token is set in another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === "luxeboard.authToken" || e.key === "luxeboard.authUser") {
        setToken(getAuthToken());
        setUser(getAuthUser());
      }
    };

    // Listen for custom auth change events (for same-tab changes)
    const handleAuthChange = () => {
      setToken(getAuthToken());
      setUser(getAuthUser());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const login = (authValue, userData) => {
    setAuthToken(authValue);
    setToken(authValue);
    if (userData) {
      setAuthUser(userData);
      setUser(userData);
    }
  };

  const logout = () => {
    clearAuthToken();
    clearAuthUser();
    setToken(null);
    setUser(null);
  };

  return { token, user, isAuthenticated: Boolean(token), isLoading, login, logout };
}

export function useRequireAuth() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [token, isLoading, router]);

  return { isAuthenticated, isLoading };
}


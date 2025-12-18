"use client";

const TOKEN_KEY = "luxeboard.authToken";
const USER_KEY = "luxeboard.authUser";

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Dispatch custom event to notify auth state change
  window.dispatchEvent(new Event("auth-change"));
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // Dispatch custom event to notify auth state change
  window.dispatchEvent(new Event("auth-change"));
};

export const getAuthUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setAuthUser = (user) => {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth-change"));
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Dispatch custom event to notify auth state change
  window.dispatchEvent(new Event("auth-change"));
};

export const clearAuthUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  // Dispatch custom event to notify auth state change
  window.dispatchEvent(new Event("auth-change"));
};


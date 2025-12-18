"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { setAuthToken, setAuthUser, getAuthToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("🔵 Attempting login for:", formData.email);
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      
      console.log("✅ Login response:", response);
      
      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken;
      const user =
        response?.user ||
        response?.data?.user ||
        null;

      if (!token) {
        console.error("❌ No token in response:", response);
        throw new Error("Login succeeded but no token was returned.");
      }

      console.log("✅ Token received, saving to localStorage");
      setAuthToken(token);
      setAuthUser(user);
      setSuccess(true);
      
      // Use replace instead of push to avoid back button issues
      setTimeout(() => {
        console.log("🔄 Redirecting to dashboard");
        router.replace("/dashboard");
      }, 500);
    } catch (err) {
      // Better error message handling
      let errorMessage = err.message || "Failed to login. Please try again.";
      
      // Parse JSON error if it's a stringified JSON
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error) {
          errorMessage = parsed.error;
        }
      } catch {
        // Not JSON, use as is
      }
      
      // User-friendly error messages
      if (errorMessage.toLowerCase().includes("invalid") || 
          errorMessage.toLowerCase().includes("password") ||
          errorMessage.toLowerCase().includes("email")) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (errorMessage.toLowerCase().includes("network") ||
                 errorMessage.toLowerCase().includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-2xl text-blue-600">
            🏠
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">
            Sign in with your Airbnb account to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="you@airbnb.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Login successful! Redirecting…
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Signing in…" : "Login"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Don’t have an account?{" "}
            <Link href="/register" className="font-semibold text-slate-900 underline-offset-2 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


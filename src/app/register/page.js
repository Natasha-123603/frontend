"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { setAuthToken, setAuthUser, getAuthToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerUser(formData);
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
        throw new Error("Registration succeeded but no token was returned.");
      }

      setAuthToken(token);
      setAuthUser(user);
      setSuccess("Account created successfully! Redirecting to dashboard…");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 500);
    } catch (err) {
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-2xl text-emerald-600">
            🏠
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
          <p className="text-sm text-slate-500">
            Invite-only access for Airbnb operators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Nora Summers"
            />
          </div>

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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Choose a strong password"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isSubmitting ? "Creating account…" : "Register"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Already have access?{" "}
            <Link href="/login" className="font-semibold text-slate-900 underline-offset-2 hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


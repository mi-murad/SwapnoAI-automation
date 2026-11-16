
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("Login succeeded, but no session was returned.");
      }

      router.push("/supabase-test");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "#f4f6fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "36px",
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          AI Ads Manager
        </h1>

        <p style={{ color: "#666", marginBottom: "28px" }}>
          Sign in to manage your advertising campaigns.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "13px",
              margin: "8px 0 20px",
              border: "1px solid #ccc",
              borderRadius: "7px",
              boxSizing: "border-box",
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "13px",
              margin: "8px 0 20px",
              border: "1px solid #ccc",
              borderRadius: "7px",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p
              role="alert"
              style={{
                color: "#dc2626",
                background: "#fef2f2",
                padding: "12px",
                borderRadius: "7px",
                marginBottom: "18px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "7px",
              background: "#2563eb",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "12px",
            color: "#888",
          }}
        >
          Secure authentication powered by Supabase
        </p>
      </section>
    </main>
  );
}

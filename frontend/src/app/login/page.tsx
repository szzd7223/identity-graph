"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../services/supabase";
import { api } from "../../services/api";
import Link from "next/link";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import { GitHubLogoIcon, InfoCircledIcon } from "@radix-ui/react-icons";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const redirectUser = async () => {
    try {
      await api.getMyProfile();
      router.replace("/dashboard");
    } catch (err: any) {
      if (err.message && (err.message.includes("PROFILE_NOT_FOUND") || err.message.toLowerCase().includes("profile not found"))) {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    }
  };

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await redirectUser();
      }
    };
    check();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isSignUp) {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (err) throw err;
        if (data.session) {
          await redirectUser();
        } else {
          setMessage("Check your inbox to confirm your email.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        await redirectUser();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (err) throw err;
    } catch (err: any) {
      setError(err.message || "OAuth login failed.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fbf9f4", color: "#181616" }}>
      {/* Header */}
      <header style={{ width: "100%", padding: "20px 32px", borderBottom: "1px solid #e7e4dc", background: "#ffffff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" className="brand-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="2.5" fill="currentColor" />
              <circle cx="18" cy="6" r="2.5" fill="currentColor" />
              <circle cx="12" cy="18" r="2.5" fill="currentColor" />
              <line x1="8.2" y1="6" x2="15.8" y2="6" />
              <line x1="7.5" y1="8" x2="10.8" y2="16" />
              <line x1="16.5" y1="8" x2="13.2" y2="16" />
            </svg>
            <span>IdentityGraph</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Form Container */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "24px", padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
          
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#181616" }}>
              {isSignUp ? "Create Your Identity Graph" : "Welcome Back"}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#78716c", marginTop: "6px" }}>
              {isSignUp ? "Set up your developer profile & mcp server" : "Sign in to manage your public identity & mcp context"}
            </p>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "10px 14px", borderRadius: "10px", fontSize: "0.82rem", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#166534", padding: "10px 14px", borderRadius: "10px", fontSize: "0.82rem", marginBottom: "20px" }}>
              {message}
            </div>
          )}

          {/* Social Auth */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={() => handleOAuth("github")}
              className="btn-secondary"
              style={{ width: "100%", justifyContent: "center", padding: "11px 16px", borderRadius: "12px", fontSize: "0.88rem" }}
            >
              <GitHubLogoIcon style={{ width: 18, height: 18, marginRight: 8 }} />
              Continue with GitHub
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "#a8a29e", fontSize: "0.78rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#e7e4dc" }} />
            <span style={{ padding: "0 12px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>or email</span>
            <div style={{ flex: 1, height: "1px", background: "#e7e4dc" }} />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-yellow-pill"
              disabled={loading}
              style={{ width: "100%", padding: "12px", marginTop: "8px", fontSize: "0.95rem" }}
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#78716c" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
              style={{ background: "none", border: "none", color: "#181616", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

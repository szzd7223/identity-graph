"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../services/supabase";
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

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
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
        if (data.session) router.push("/dashboard");
        else setMessage("Check your inbox to confirm your email.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (err) throw err;
    } catch (err: any) {
      setError(err.message || "OAuth failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>

      <div style={{ position: "fixed", top: "16px", right: "16px" }}>
        <ThemeToggle />
      </div>

      <div className="card" style={{ width: "100%", maxWidth: "380px" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "4px" }}>
            {isSignUp ? "Create account" : "Sign in"}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            {isSignUp ? "Start building your career graph" : "Manage your profile and MCP connections"}
          </p>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--color-bg-subtle)", border: "1px solid var(--color-danger)", borderRadius: "var(--radius-md)", padding: "10px 12px", marginBottom: "16px", fontSize: "0.82rem", color: "var(--color-danger)" }}>
            <InfoCircledIcon />
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "10px 12px", marginBottom: "16px", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: "4px" }} disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "18px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
        </div>

        <button onClick={handleGitHub} className="btn-secondary" style={{ width: "100%", gap: "8px" }} disabled={loading}>
          <GitHubLogoIcon width={16} height={16} />
          Continue with GitHub
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
            className="btn-ghost"
          >
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </button>
          <Link href="/" className="btn-ghost">← Home</Link>
        </div>

      </div>
    </div>
  );
}

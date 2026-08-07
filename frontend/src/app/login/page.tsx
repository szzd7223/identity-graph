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
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      padding: "24px",
      background: "var(--color-bg)",
      color: "var(--color-text)",
      fontFamily: "var(--font-sans)",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "rgba(16, 185, 129, 0.04)",
        filter: "blur(80px)",
        pointerEvents: "none"
      }} />

      <div style={{ position: "fixed", top: "24px", right: "24px" }}>
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Link href="/" style={{ textDecoration: "none", color: "var(--color-text)" }}>
          <span style={{ 
            fontFamily: "var(--font-title)", 
            fontWeight: 800, 
            fontSize: "1.5rem", 
            letterSpacing: "-0.04em",
            display: "inline-flex",
            alignItems: "center"
          }}>
            IdentityGraph
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-accent)", marginLeft: "4px", display: "inline-block", boxShadow: "0 0 8px var(--color-accent)" }} />
          </span>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="card" style={{ width: "100%", maxWidth: "400px", zIndex: 10 }}>

        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ 
            fontSize: "1.35rem", 
            fontWeight: 700, 
            fontFamily: "var(--font-title)",
            letterSpacing: "-0.02em",
            marginBottom: "6px" 
          }}>
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
            {isSignUp ? "Start building your career database" : "Manage your profile data and MCP connections"}
          </p>
        </div>

        {error && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "rgba(239, 68, 68, 0.05)", 
            border: "1px solid var(--color-danger)", 
            borderRadius: "var(--radius-md)", 
            padding: "12px", 
            marginBottom: "20px", 
            fontSize: "0.82rem", 
            color: "var(--color-danger)" 
          }}>
            <InfoCircledIcon />
            {error}
          </div>
        )}

        {message && (
          <div style={{ 
            background: "var(--color-bg-subtle)", 
            border: "1px solid var(--color-border)", 
            borderRadius: "var(--radius-md)", 
            padding: "12px", 
            marginBottom: "20px", 
            fontSize: "0.82rem", 
            color: "var(--color-text-muted)" 
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ height: "42px", borderRadius: "var(--radius-md)" }}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ height: "42px", borderRadius: "var(--radius-md)" }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: "8px", height: "42px", borderRadius: "var(--radius-md)" }} 
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-faint)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
        </div>

        <button 
          onClick={handleGitHub} 
          className="btn-secondary" 
          style={{ width: "100%", gap: "8px", height: "42px", borderRadius: "var(--radius-md)" }} 
          disabled={loading}
        >
          <GitHubLogoIcon width={16} height={16} />
          GitHub Account
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--color-border)" }}>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
            className="btn-ghost"
            style={{ paddingLeft: 0 }}
          >
            {isSignUp ? "Already registered?" : "New here? Sign up"}
          </button>
          <Link href="/" className="btn-ghost" style={{ paddingRight: 0 }}>← Back home</Link>
        </div>

      </div>
    </div>
  );
}

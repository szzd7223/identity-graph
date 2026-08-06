"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../services/supabase";
import Link from "next/link";
import { Flex, Text } from "@radix-ui/themes";
import { GitHubLogoIcon, InfoCircledIcon } from "@radix-ui/react-icons";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Redirect to dashboard if session exists
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkUser();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (signUpError) throw signUpError;
        
        if (data.session) {
          router.push("/dashboard");
        } else {
          setMessage("Confirmation email sent! Please check your inbox.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || "OAuth login failed.");
      setLoading(false);
    }
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: "100vh", padding: "20px", background: "#050505", position: "relative", overflow: "hidden" }}>
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(217, 78, 78, 0.04) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(255, 255, 255, 0.01) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }}></div>

      <div className="apple-glass" style={{ maxWidth: "440px", width: "100%", padding: "40px", zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="mono-label" style={{ marginBottom: "8px" }}>access portal</div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <Text size="2" style={{ color: "var(--muted-foreground)", marginTop: "6px", display: "block" }}>
            {isSignUp ? "Sign up to start building your career graph" : "Log in to manage your profile and MCP connections"}
          </Text>
        </div>

        {/* Status Indicators */}
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "rgb(248, 113, 113)", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
            <InfoCircledIcon />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div style={{ background: "rgba(217, 78, 78, 0.1)", border: "1px solid rgba(217, 78, 78, 0.3)", color: "#e05e5e", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
            <InfoCircledIcon />
            <span>{message}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "8px", padding: "12px" }} disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "lowercase", fontFamily: "var(--font-mono)" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
        </div>

        {/* Social GitHub Auth */}
        <button 
          onClick={handleGitHubLogin} 
          className="btn-secondary" 
          style={{ width: "100%", padding: "12px", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}
          disabled={loading}
        >
          <GitHubLogoIcon width="18" height="18" />
          <span>Continue with GitHub</span>
        </button>

        {/* Toggle link */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
            style={{ background: "none", border: "none", color: "var(--coral)", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600 }}
          >
            {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textDecoration: "none" }}>
            ← back to home
          </Link>
        </div>

      </div>
    </Flex>
  );
}

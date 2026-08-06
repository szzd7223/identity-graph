"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../services/supabase";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testUsername, setTestUsername] = useState("johndoe");

  useEffect(() => {
    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setLoading(false);
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, ns) => setSession(ns));
      return () => subscription.unsubscribe();
    };
    init();
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>

      {/* Top-right theme toggle */}
      <div style={{ position: "fixed", top: "16px", right: "16px" }}>
        <ThemeToggle />
      </div>

      <main style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "6px" }}>IdentityGraph</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            Manage your professional career profile. Power portfolio layouts and local AI assistants via Model Context Protocol.
          </p>
        </div>

        {/* Auth box */}
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "20px", background: "var(--color-surface)" }}>
          {loading ? (
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Loading session...</p>
          ) : session ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                Signed in as <strong style={{ color: "var(--color-text)" }}>{session.user.email}</strong>
              </p>
              <Link href="/dashboard" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                Sign in to create and manage your developer portfolio.
              </p>
              <Link href="/login" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                Sign In →
              </Link>
            </div>
          )}
        </div>

        {/* Portfolio preview */}
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "20px", background: "var(--color-surface)" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginBottom: "10px", fontWeight: 500 }}>
            Preview a portfolio layout
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>@</span>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "26px" }}
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="username"
              />
            </div>
            <Link href={`/portfolio/${testUsername}`} className="btn-secondary">
              View
            </Link>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "8px" }}>
            Try <code style={{ fontFamily: "var(--font-mono)" }}>johndoe</code> to see a seeded profile.
          </p>
        </div>

        {/* Footer */}
        <footer style={{ fontSize: "0.75rem", color: "var(--color-text-faint)", display: "flex", gap: "12px" }}>
          <span>API :3001</span>
          <span>·</span>
          <span>MCP stdio</span>
          <span>·</span>
          <span>Supabase Auth</span>
        </footer>

      </main>
    </div>
  );
}

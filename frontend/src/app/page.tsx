"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../services/supabase";
import { Text } from "@radix-ui/themes";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testUsername, setTestUsername] = useState("johndoe");

  useEffect(() => {
    const getSessionAndListen = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    getSessionAndListen();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center", alignItems: "center", padding: "40px", background: "#050505", position: "relative", overflow: "hidden" }}>
      {/* Background radial effects */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(217, 78, 78, 0.04) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(255, 255, 255, 0.01) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }}></div>

      <main className="apple-glass" style={{ padding: "50px", maxWidth: "650px", width: "100%", textAlign: "center", zIndex: 1 }}>
        
        {/* Logo Icon Mock */}
        <div style={{ display: "inline-flex", width: "64px", height: "64px", borderRadius: "16px", background: "var(--coral)", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "#fff", fontWeight: "800", marginBottom: "25px", boxShadow: "0 8px 30px rgba(217, 78, 78, 0.3)" }}>
          I
        </div>

        <h1 style={{ fontSize: "2.75rem", marginBottom: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
          IdentityGraph
        </h1>

        <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: "40px" }}>
          Build, customize, and manage your professional career details. 
          Enables beautiful responsive web layouts and powers local AI assistants with verified context via Model Context Protocol.
        </p>

        {/* Dashboard Access Control Box */}
        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "12px", padding: "30px", marginBottom: "35px", textAlign: "center" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
              <div style={{ width: "24px", height: "24px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--coral)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
              <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
              `}</style>
            </div>
          ) : session ? (
            <div>
              <Text style={{ display: "block", fontSize: "0.9rem", color: "#fff", fontWeight: 600, marginBottom: "16px" }}>
                Authenticated session active as <strong>{session.user.email}</strong>
              </Text>
              <Link 
                href="/dashboard"
                className="btn-primary"
                style={{ textDecoration: "none", display: "inline-flex", padding: "12px 30px" }}
              >
                Go to Builder Dashboard
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginBottom: "16px" }}>
                Log in to create and manage your personal developer portfolio.
              </p>
              <Link 
                href="/login"
                className="btn-primary"
                style={{ textDecoration: "none", display: "inline-flex", padding: "12px 30px" }}
              >
                Sign In to access dashboard
              </Link>
            </div>
          )}
        </div>

        {/* View Seeded Public Profile to Test Layouts */}
        <div style={{ background: "rgba(255, 255, 255, 0.015)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", textAlign: "left" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--muted-foreground)", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            [ Test View Portfolio Layouts ]
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", fontWeight: "600", fontSize: "0.95rem" }}>
                @
              </span>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "32px", fontSize: "0.95rem", fontWeight: "600" }}
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="username"
              />
            </div>
            <Link 
              href={`/portfolio/${testUsername}`}
              className="btn-secondary"
              style={{ fontSize: "0.9rem", padding: "0 20px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              View Portfolio Layout
            </Link>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "8px" }}>
            Tip: Try the seeded profile username <strong>&apos;johndoe&apos;</strong> to see customizable layouts immediately.
          </p>
        </div>

      </main>

      {/* Footer Info */}
      <footer style={{ marginTop: "40px", fontSize: "0.8rem", color: "var(--muted-foreground)", display: "flex", gap: "20px", zIndex: 1 }}>
        <span>Backend API: localhost:3001</span>
        <span>•</span>
        <span>MCP Server: stdio mode</span>
        <span>•</span>
        <span>Supabase Auth: Configured</span>
      </footer>
    </div>
  );
}

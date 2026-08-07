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
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)", display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)" }}>
      
      {/* Frosted / Fixed Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ 
            fontFamily: "var(--font-title)", 
            fontWeight: 800, 
            fontSize: "1.25rem", 
            letterSpacing: "-0.04em",
            display: "inline-flex",
            alignItems: "center"
          }}>
            IdentityGraph
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-accent)", marginLeft: "4px", display: "inline-block", boxShadow: "0 0 8px var(--color-accent)" }} />
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {loading ? (
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>checking...</span>
          ) : session ? (
            <Link href="/dashboard" className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
              Sign In
            </Link>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Landing Page */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px" }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: "center", maxWidth: "900px", marginBottom: "80px" }}>
          {/* Badge */}
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "6px 14px", 
            borderRadius: "100px", 
            background: "rgba(16, 185, 129, 0.06)", 
            border: "1px solid rgba(16, 185, 129, 0.2)", 
            color: "var(--color-accent)", 
            fontSize: "0.75rem", 
            fontWeight: 600, 
            textTransform: "uppercase", 
            letterSpacing: "0.08em",
            marginBottom: "24px" 
          }}>
            <span>● Live MCP Server Enabled</span>
          </div>

          {/* Heading */}
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 6.5vw, 4.25rem)", 
            fontWeight: 800, 
            fontFamily: "var(--font-title)", 
            letterSpacing: "-0.04em", 
            lineHeight: 1.1, 
            marginBottom: "24px",
            color: "var(--color-text)"
          }}>
            Your professional presence.<br />
            <span style={{ 
              background: "linear-gradient(90deg, var(--color-accent) 0%, #60a5fa 100%)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}>
              Powered by AI & MCP.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{ 
            fontSize: "1.1rem", 
            color: "var(--color-text-muted)", 
            maxWidth: "600px", 
            margin: "0 auto 36px auto", 
            lineHeight: 1.6 
          }}>
            Build a standardized career database. Power premium, responsive portfolio layouts automatically and expose your resume schema to local development assistants.
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            {session ? (
              <Link href="/dashboard" className="btn-primary">
                Go to Builder Dashboard
              </Link>
            ) : (
              <Link href="/login" className="btn-primary">
                Get Started Now
              </Link>
            )}
            <a href="#sandbox" className="btn-secondary">
              Preview Demo Layouts
            </a>
          </div>
        </section>

        {/* Sandbox Preview Section */}
        <section id="sandbox" style={{ width: "100%", maxWidth: "580px", marginBottom: "90px" }}>
          <div className="card" style={{ padding: "32px", position: "relative", overflow: "hidden" }}>
            
            {/* Subtle glow decorative blur in background */}
            <div style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.08)",
              filter: "blur(40px)",
              pointerEvents: "none"
            }} />

            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff4eaf" }} />
              Interactive Portfolio Sandbox
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "20px" }}>
              Enter any builder username below to preview live portfolio layouts directly.
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ 
                  position: "absolute", 
                  left: "14px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: "var(--color-text-faint)", 
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-mono)"
                }}>@</span>
                <input
                  type="text"
                  className="form-input"
                  style={{ 
                    paddingLeft: "30px", 
                    borderRadius: "var(--radius-md)", 
                    height: "44px",
                    background: "rgba(255, 255, 255, 0.01)" 
                  }}
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  placeholder="username"
                />
              </div>
              <Link href={`/portfolio/${testUsername}`} className="btn-secondary" style={{ height: "44px", borderRadius: "var(--radius-md)" }}>
                View Portfolio
              </Link>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: "12px", display: "flex", gap: "6px" }}>
              💡 Tip: Enter <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}>johndoe</code> to inspect the pre-seeded profile.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section style={{ 
          width: "100%", 
          maxWidth: "1020px", 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "24px",
          marginBottom: "60px"
        }}>
          
          {/* Card 1 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "10px", 
              background: "rgba(16, 185, 129, 0.08)", 
              border: "1px solid rgba(16, 185, 129, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-accent)"
            }}>
              🔌
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px" }}>MCP Native Integration</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                Expose your experiences directly to LLM assistants. Connect local environments like Cursor to write code with instant context.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "10px", 
              background: "rgba(255, 78, 175, 0.08)", 
              border: "1px solid rgba(255, 78, 175, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ff4eaf"
            }}>
              🎨
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px" }}>Teak.io Aesthetics</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                Toggle layouts built for visual impact. Choose between organic sage card grids, minimalist lists, or cyberpunk dark mode templates.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "10px", 
              background: "rgba(95, 68, 230, 0.08)", 
              border: "1px solid rgba(95, 68, 230, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ac92ff"
            }}>
              ⚡
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px" }}>Realtime Syncing</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                All credentials, details, and layout preferences sync dynamically via Supabase. Fast loading and responsive on all displays.
              </p>
            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: "1px solid var(--color-border)", 
        padding: "24px 32px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap",
        gap: "16px",
        fontSize: "0.78rem", 
        color: "var(--color-text-faint)",
        background: "var(--color-bg-subtle)"
      }}>
        <div>
          <span>© 2026 IdentityGraph. Built with Next.js & Supabase.</span>
        </div>
        <div style={{ display: "flex", gap: "16px", fontFamily: "var(--font-mono)" }}>
          <span>PORT: 3001</span>
          <span>•</span>
          <span>mcp stdio</span>
          <span>•</span>
          <span>supabase client</span>
        </div>
      </footer>

    </div>
  );
}

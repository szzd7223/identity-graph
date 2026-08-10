"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { ScrollReveal } from "./ScrollReveal";

export function CtaFooterSection() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
    };
    checkAuth();
  }, []);

  return (
    <section style={{ width: "100%", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "60px 32px 40px 32px", display: "flex", flexDirection: "column", gap: "80px" }}>
        
        {/* CTA Banner Card: Ready to level up? */}
        <ScrollReveal delayMs={100}>
          <div style={{ 
            background: "#ffffff", 
            border: "1.5px solid #e7e4dc", 
            borderRadius: "28px", 
            padding: "52px 44px", 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
            gap: "44px", 
            alignItems: "center",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)"
          }}>
          {/* Left Side text & CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "4px 12px", border: "1px solid #d6d3c9", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#57534e", fontWeight: 600 }}>
              Get started with IdentityGraph
            </div>
            
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, color: "#181616", lineHeight: 1.15, letterSpacing: "-0.035em" }}>
              Ready to level up your career graph?
            </h2>

            <p style={{ fontSize: "1.02rem", color: "#68686e", lineHeight: 1.6, maxWidth: "480px" }}>
              Join builders using IdentityGraph to power zero-hallucination pitches and instant web portfolios.
            </p>

            <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
              {session ? (
                <Link href="/dashboard" className="btn-yellow-pill" style={{ padding: "14px 28px", fontSize: "1rem" }}>
                  <span>Go to Builder Dashboard</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <polygon points="2,1 9,5 2,9" />
                  </svg>
                </Link>
              ) : (
                <Link href="/login" className="btn-yellow-pill" style={{ padding: "14px 28px", fontSize: "1rem" }}>
                  <span>Get Started Free</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <polygon points="2,1 9,5 2,9" />
                  </svg>
                </Link>
              )}

              <Link href="/demo" className="btn-login-link" style={{ fontSize: "0.88rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span>See Live Demo</span>
                <span style={{ fontSize: "0.75rem" }}>▶</span>
              </Link>
            </div>
          </div>

          {/* Right Side Visual Graphic */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ 
              width: "320px", 
              background: "#181616", 
              color: "#ffffff", 
              borderRadius: "20px", 
              padding: "24px", 
              boxShadow: "6px 6px 0px #fed743", 
              display: "flex", 
              flexDirection: "column", 
              gap: "16px" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#fed743" }}>LIVE STATUS</span>
                </div>
                <span style={{ fontSize: "0.72rem", color: "#a1a1aa", fontFamily: "var(--font-mono)" }}>v1.0.0</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.82rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6ee7b7" }}>
                  <span>✓</span>
                  <span>MCP Server Connected</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6ee7b7" }}>
                  <span>✓</span>
                  <span>100% Synced Schema</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6ee7b7" }}>
                  <span>✓</span>
                  <span>Ready for Cursor & Claude</span>
                </div>
              </div>

              <div style={{ background: "#27272a", padding: "10px 14px", borderRadius: "10px", fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#a1a1aa" }}>
                $ npx @identitygraph/mcp-server
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* Structured Footer */}
        <ScrollReveal delayMs={150}>
          <footer style={{ borderTop: "1px solid rgba(24, 22, 22, 0.1)", paddingTop: "48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "40px", alignItems: "start" }}>
          
          {/* Left Column: Brand logo & Copyright */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Link href="/" className="brand-title">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#181616" }}
              >
                <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                <circle cx="18" cy="6" r="2.5" fill="currentColor" />
                <circle cx="12" cy="18" r="2.5" fill="currentColor" />
                <line x1="8.2" y1="6" x2="15.8" y2="6" />
                <line x1="7.5" y1="8" x2="10.8" y2="16" />
                <line x1="16.5" y1="8" x2="13.2" y2="16" />
              </svg>
              <span>IdentityGraph</span>
            </Link>

            <p style={{ fontSize: "0.85rem", color: "#78716c", lineHeight: 1.5, paddingLeft: "34px" }}>
              © 2026 IdentityGraph.
            </p>
          </div>

          {/* Right Link Columns Grid */}
          <div style={{ display: "flex", gap: "48px", justifyContent: "flex-end", textAlign: "right" }}>
            {/* Column 1: Product */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616", textTransform: "uppercase", letterSpacing: "0.05em" }}>Product</div>
              <Link href="/dashboard" style={{ fontSize: "0.85rem", color: "#78716c", textDecoration: "none" }}>Dashboard</Link>
              <Link href="/demo" style={{ fontSize: "0.85rem", color: "#78716c", textDecoration: "none" }}>Example Portfolio</Link>
              <Link href="/login" style={{ fontSize: "0.85rem", color: "#78716c", textDecoration: "none" }}>Get Started</Link>
            </div>

            {/* Column 2: Connect */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616", textTransform: "uppercase", letterSpacing: "0.05em" }}>Connect</div>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "#78716c", textDecoration: "none" }}>GitHub ↗</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "#78716c", textDecoration: "none" }}>Twitter ↗</a>
            </div>
          </div>

        </footer>
        </ScrollReveal>

      </div>
    </section>
  );
}

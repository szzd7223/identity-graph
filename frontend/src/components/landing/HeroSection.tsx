"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section style={{ width: "100%", padding: "50px 32px 90px 32px", minHeight: "calc(100vh - 100px)", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
        
        {/* Left Column: Headline, Subheading, Button & Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "660px" }}>
          
          {/* Main Headline */}
          <h1 style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)", fontWeight: 800, color: "#181616", lineHeight: 1.18, letterSpacing: "-0.035em" }}>
            Ideating personalized Emails and Pitches doesn't have to be{" "}
            <span className="highlight-yellow">frustrating</span>
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: "1.05rem", color: "#57534e", lineHeight: 1.6, maxWidth: "580px" }}>
            IdentityGraph makes sure your LLMs have the correct context about you so that you don't have to cross check stale or made up data while writing emails or applying to jobs.
          </p>

          {/* Call to Action Button */}
          <div style={{ marginTop: "8px" }}>
            <a href="#demo" className="btn-yellow-pill">
              <span>See it in action</span>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="2,1 9,5 2,9" />
              </svg>
            </a>
          </div>

          {/* Metrics Row */}
          <div style={{ display: "flex", gap: "40px", marginTop: "24px", paddingTop: "24px", borderTop: "1px dashed rgba(24, 22, 22, 0.15)", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#181616", fontFamily: "var(--font-title)" }}>10x+</div>
              <div style={{ fontSize: "0.78rem", color: "#78716c", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>Context Accuracy</div>
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#181616", fontFamily: "var(--font-title)" }}>100%</div>
              <div style={{ fontSize: "0.78rem", color: "#78716c", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>MCP Native</div>
            </div>
            <div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#181616", fontFamily: "var(--font-title)" }}>0</div>
              <div style={{ fontSize: "0.78rem", color: "#78716c", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>Hallucinations</div>
            </div>
          </div>

        </div>

        {/* Right Column: Phone/Card Mockup with Continuous Swipe-up Animation */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ 
            width: "320px", 
            height: "480px", 
            borderRadius: "36px", 
            background: "#fffefb", 
            border: "2px solid #181616", 
            boxShadow: "8px 8px 0px #181616", 
            overflow: "hidden", 
            position: "relative",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Top Device Bar */}
            <div style={{ padding: "16px 20px 12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0eee6", background: "#fcfbf7" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f56" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffbd2e" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27c93f" }} />
              </div>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#78716c", letterSpacing: "0.05em" }}>LIVE CONTEXT</span>
            </div>

            {/* Swipe Up Animated Window */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <div className="animate-swipe-up" style={{ display: "flex", flexDirection: "column", height: "300%" }}>
                
                {/* SVG Card 1: Email Generation */}
                <div style={{ height: "33.333%", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fed743", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✉</div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#181616" }}>Cold Email Generator</div>
                      <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>Context: Past Engineering Achievements</div>
                    </div>
                  </div>
                  <div style={{ padding: "12px", background: "#faf8f2", borderRadius: "12px", border: "1px solid #e7e5dd", fontSize: "0.78rem", color: "#44403c", lineHeight: 1.4 }}>
                    "Hi Sarah, saw your post on distributed queues. At IdentityGraph, I led zero-downtime database migrations..."
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ Verified Stats</span>
                    <span style={{ fontSize: "0.68rem", background: "#d1fae5", color: "#065f46", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ MCP Synced</span>
                  </div>
                </div>

                {/* SVG Card 2: Pitch Deck Bio Context */}
                <div style={{ height: "33.333%", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center", borderTop: "1px dashed #e7e5dd" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#181616", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>⚡</div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#181616" }}>Founder & Builder Pitch</div>
                      <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>Context: Live Credentials Schema</div>
                    </div>
                  </div>
                  <div style={{ padding: "12px", background: "#faf8f2", borderRadius: "12px", border: "1px solid #e7e5dd", fontSize: "0.78rem", color: "#44403c", lineHeight: 1.4 }}>
                    "Our LLM assistant fetched verified project stats: 100k+ API requests processed with 99.9% uptime."
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ fontSize: "0.68rem", background: "#e0e7ff", color: "#3730a3", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ Zero Hallucination</span>
                  </div>
                </div>

                {/* SVG Card 3: Job Application Pitch */}
                <div style={{ height: "33.333%", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center", borderTop: "1px dashed #e7e5dd" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#34d399", color: "#181616", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>🚀</div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#181616" }}>Tailored Cover Letter</div>
                      <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>Context: Real-time Skill Graph</div>
                    </div>
                  </div>
                  <div style={{ padding: "12px", background: "#faf8f2", borderRadius: "12px", border: "1px solid #e7e5dd", fontSize: "0.78rem", color: "#44403c", lineHeight: 1.4 }}>
                    "Automatically matching your verified career history with target role requirements without cross-checking."
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ Realtime Sync</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

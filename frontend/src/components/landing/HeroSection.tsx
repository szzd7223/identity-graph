"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section style={{ width: "100%", minHeight: "calc(100vh - 100px)", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "50px 32px 90px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
        
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
            <Link href="/demo" className="btn-yellow-pill">
              <span>See it in action</span>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="2,1 9,5 2,9" />
              </svg>
            </Link>
          </div>

        </div>

        {/* Right Column: Browser Window Mockup in Landscape with Continuous Swipe-up Animation */}
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <div style={{ 
            width: "100%",
            maxWidth: "500px", 
            height: "310px", 
            borderRadius: "20px", 
            background: "#fffefb", 
            border: "2px solid #181616", 
            boxShadow: "8px 8px 0px #181616", 
            overflow: "hidden", 
            position: "relative",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Top Device Bar */}
            <div style={{ padding: "14px 20px 10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0eee6", background: "#fcfbf7" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ff5f56" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ffbd2e" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#27c93f" }} />
              </div>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#78716c", letterSpacing: "0.05em" }}>LIVE CONTEXT ENGINE</span>
            </div>

            {/* Swipe Up Animated Window */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <div className="animate-swipe-up" style={{ display: "flex", flexDirection: "column", height: "300%" }}>
                
                {/* SVG Card 1: Email Generation */}
                <div style={{ height: "33.333%", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fed743", color: "#181616", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#181616" }}>Cold Email Generator</div>
                        <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>Context: Past Engineering Achievements</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ Verified Stats</span>
                  </div>
                  <div style={{ padding: "12px 14px", background: "#faf8f2", borderRadius: "10px", border: "1px solid #e7e5dd", fontSize: "0.8rem", color: "#44403c", lineHeight: 1.45 }}>
                    "Hi Sarah, saw your post on distributed queues. At IdentityGraph, I led zero-downtime database migrations with 99.99% uptime..."
                  </div>
                </div>

                {/* SVG Card 2: Pitch Deck Bio Context */}
                <div style={{ height: "33.333%", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", borderTop: "1px dashed #e7e5dd" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#181616", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#181616" }}>Founder &amp; Builder Pitch</div>
                        <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>Context: Live Credentials Schema</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.68rem", background: "#e0e7ff", color: "#3730a3", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ Zero Hallucination</span>
                  </div>
                  <div style={{ padding: "12px 14px", background: "#faf8f2", borderRadius: "10px", border: "1px solid #e7e5dd", fontSize: "0.8rem", color: "#44403c", lineHeight: 1.45 }}>
                    "Our LLM assistant fetched verified project stats: 100k+ API requests processed seamlessly without prompt tweaking..."
                  </div>
                </div>

                {/* SVG Card 3: Job Application Pitch */}
                <div style={{ height: "33.333%", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", borderTop: "1px dashed #e7e5dd" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#34d399", color: "#181616", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#181616" }}>Tailored Cover Letter</div>
                        <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>Context: Real-time Skill Graph</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.68rem", background: "#d1fae5", color: "#065f46", padding: "3px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ MCP Synced</span>
                  </div>
                  <div style={{ padding: "12px 14px", background: "#faf8f2", borderRadius: "10px", border: "1px solid #e7e5dd", fontSize: "0.8rem", color: "#44403c", lineHeight: 1.45 }}>
                    "Automatically matching verified career history with target role requirements without manual cross-checking..."
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

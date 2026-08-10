"use client";

import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

export function ProblemSolutionSection() {
  return (
    <section style={{ width: "100%" }}>
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "40px 32px 100px 32px", display: "flex", flexDirection: "column", gap: "40px" }}>

        {/* Top Split Header */}
        <ScrollReveal delayMs={50}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", alignItems: "start" }}>
            <div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", fontWeight: 800, color: "#181616", lineHeight: 1.18, letterSpacing: "-0.035em", maxWidth: "480px" }}>
                Career context built for modern AI workflows
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "560px" }}>
              <p style={{ fontSize: "1.05rem", color: "#57534e", lineHeight: 1.6 }}>
                Let's face it, general-purpose LLMs aren't aware of your real-time career achievements. IdentityGraph exposes a standardized schema directly to your local AI tools (Cursor, Claude, ChatGPT), eliminating hallucinated stats and tedious copy-pasting.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Bento Box Container Card */}
        <ScrollReveal delayMs={150}>
          <div style={{
            background: "#faf8f3",
            border: "1.5px solid #e7e4dc",
            borderRadius: "28px",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.015)"
          }}>

            {/* Card 1: Top Featured Full-Width Card */}
            <div
              className="bento-card-hover"
              style={{
                background: "#ffffff",
                border: "1px solid #e7e4dc",
                borderRadius: "20px",
                padding: "32px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "440px" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#181616" }}>
                  Latest Context Always
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#68686e", lineHeight: 1.55 }}>
                  Structured credentials tied directly to your prompts. One setup powers every LLM tool and client touchpoint.
                </p>
              </div>

              {/* Visual Block: Schema Mapping & Message Preview */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", background: "#fbf9f4", padding: "20px", borderRadius: "16px", border: "1px solid #ece9df" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="animate-pulse-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#181616" }}>IDENTITY SCHEMA</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>Work History</span>
                    <span style={{ fontSize: "0.68rem", background: "#e0e7ff", color: "#3730a3", border: "1px solid #c7d2fe", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>Live Metrics</span>
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #e7e4dc", fontSize: "0.82rem", color: "#181616", lineHeight: 1.45 }}>
                  "Hey Sarah, I led backend scale at IdentityGraph, achieving 99.99% uptime across 500k+ MCP Requests."
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", color: "#065f46", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "3px 10px", borderRadius: "9999px", fontWeight: 600 }}>✓ Local MCP Server</span>
                  <span style={{ fontSize: "0.72rem", color: "#0369a1", background: "#f0f9ff", border: "1px solid #bae6fd", padding: "3px 10px", borderRadius: "9999px", fontWeight: 600 }}>✓ Cursor / Windsurf</span>
                  <span style={{ fontSize: "0.72rem", color: "#6b21a8", background: "#faf5ff", border: "1px solid #e9d5ff", padding: "3px 10px", borderRadius: "9999px", fontWeight: 600 }}>✓ Cold Emails</span>
                </div>
              </div>
            </div>

            {/* Grid Row 2: 2 Column Split */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>

              {/* Card 2: Beautiful Portfolio, Instantly Hosted */}
              <div
                className="bento-card-hover"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e7e4dc",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px"
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#181616", marginBottom: "8px" }}>
                    Beautiful portfolio, instantly hosted
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#68686e", lineHeight: 1.55 }}>
                    IdentityGraph automatically compiles your schema into a sleek, responsive web portfolio. Share your personal URL anywhere with recruiters and clients.
                  </p>
                </div>

                {/* Visual Preview for Portfolio Share Link */}
                <div style={{ background: "#fbf9f4", padding: "16px", borderRadius: "12px", border: "1px solid #ece9df", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ffffff", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e7e4dc" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#181616" }}>identitygraph.com/portfolio/johndoe</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "0.7rem", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ Public Share Link</span>
                    <span style={{ fontSize: "0.7rem", background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>✓ Live Portfolio</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Schemas That Actually Structure */}
              <div
                className="bento-card-hover"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e7e4dc",
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "20px"
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#181616", marginBottom: "8px" }}>
                    Schemas that actually structure
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#68686e", lineHeight: 1.55 }}>
                    Define your identity by projects, tech stack, and key metrics. Combine them like modular logic blocks.
                  </p>
                </div>

                {/* Visual Logic Drag Blocks */}
                <div style={{ background: "#fbf9f4", padding: "16px", borderRadius: "12px", border: "1px solid #ece9df", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, background: "#fff", border: "1.5px solid #181616", padding: "6px 12px", borderRadius: "8px", color: "#181616" }}>Audience</span>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#a8a29e" }}>+</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, background: "#ffffff", border: "1.5px solid #181616", padding: "6px 12px", borderRadius: "8px", color: "#181616" }}>Tech Stack</span>
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#a8a29e" }}>+</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, background: "#ecfdf5", border: "1.5px solid #059669", padding: "6px 12px", borderRadius: "8px", color: "#047857" }}>Metrics</span>
                </div>
              </div>

            </div>

            {/* Card 4: Bottom Banner Card (Mix. Match. Automate.) */}
            <div
              className="bento-card-hover"
              style={{
                background: "#ffffff",
                border: "1px solid #e7e4dc",
                borderRadius: "20px",
                padding: "28px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                alignItems: "center"
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#181616", marginBottom: "6px" }}>
                  Mix. match. automate.
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#68686e", lineHeight: 1.5 }}>
                  From cold outreach emails to recruiter pitches, auto-generate authentic messages with 100% accurate context.
                </p>
              </div>

              {/* Popup preview cards */}
              <div style={{ background: "#181616", color: "#ffffff", padding: "16px 20px", borderRadius: "14px", boxShadow: "4px 4px 0px #fed743", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#fed743", textTransform: "uppercase", fontWeight: 700 }}>PROMPT CONTEXT READY</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>"Hey Sam, check out my latest open-source project with 500k downloads!"</div>
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* Setup & Integration 2-Column Split Card */}
        <ScrollReveal delayMs={200}>
          <div style={{
            background: "#ffffff",
            border: "1.5px solid #e7e4dc",
            borderRadius: "28px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.015)"
          }}>
            {/* Left Column: Title, Subtext & CTAs */}
            <div style={{ padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px", justifyContent: "center", borderRight: "1px solid #f0eee6" }}>
              <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "4px 12px", border: "1px solid #d6d3c9", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#57534e", fontWeight: 600 }}>
                Integrate in under 5 minutes
              </div>

              <h3 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, color: "#181616", lineHeight: 1.15, letterSpacing: "-0.035em" }}>
                It's as easy as it can be
              </h3>

              <p style={{ fontSize: "0.98rem", color: "#68686e", lineHeight: 1.6, maxWidth: "480px" }}>
                IdentityGraph connects in minutes so your local AI tools and web portfolios are instantly populated with real-time career data.
              </p>

              <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
                <Link href="/login" className="btn-yellow-pill" style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
                  <span>Get Started Free</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <polygon points="2,1 9,5 2,9" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column: 3 Stacked Step Cards (#connect, #customize, -> mcp context) */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Step 1: Connect */}
              <div style={{ padding: "32px 36px", borderBottom: "1px solid #f0eee6", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#181616", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: "#ffedd5", color: "#c2410c", padding: "2px 10px", borderRadius: "6px", fontSize: "1.05rem" }}>1. Connect</span>
                </div>
                <p style={{ fontSize: "0.92rem", color: "#181616", fontWeight: 600, lineHeight: 1.5 }}>
                  Connect your resume, fill up your details
                </p>
              </div>

              {/* Step 2: Customize */}
              <div style={{ padding: "32px 36px", borderBottom: "1px solid #f0eee6", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#181616", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: "#fce7f3", color: "#be185d", padding: "2px 10px", borderRadius: "6px", fontSize: "1.05rem" }}>2. Customize</span>
                </div>
                <p style={{ fontSize: "0.92rem", color: "#181616", fontWeight: 600, lineHeight: 1.5 }}>
                  Customize what you wanna show on portfolio
                </p>
              </div>

              {/* Step 3: MCP Context */}
              <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#181616", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ background: "#d1fae5", color: "#047857", padding: "2px 10px", borderRadius: "6px", fontSize: "1.05rem" }}>3. MCP Context</span>
                </div>
                <p style={{ fontSize: "0.92rem", color: "#181616", fontWeight: 600, lineHeight: 1.5 }}>
                  Use the context in any LLM by MCP
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

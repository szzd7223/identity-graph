"use client";

import { ScrollReveal } from "./ScrollReveal";

export function StorySection() {
  return (
    <section style={{ width: "100%", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "100px 32px 120px 32px", display: "flex", flexDirection: "column", gap: "100px" }}>

        {/* Section Header */}
        <ScrollReveal delayMs={50}>
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#181616", lineHeight: 1.15, letterSpacing: "-0.035em" }}>
              Outreach without the AI struggle
            </h2>
            <p style={{ fontSize: "1.08rem", color: "#68686e", lineHeight: 1.6 }}>
              How IdentityGraph turns copy pasting loops to 10 second tailored wins
            </p>
          </div>
        </ScrollReveal>

        {/* Story Rows Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: "120px" }}>

          {/* Row 1: Left Text / Right Animated Mockup */}
          <ScrollReveal delayMs={100}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "520px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, color: "#c2410c", letterSpacing: "0.08em" }}>
                  01 / THE FRUSTRATION
                </span>
                <h3 style={{ fontSize: "clamp(1.75rem, 2.8vw, 2.3rem)", fontWeight: 800, color: "#181616", lineHeight: 1.18, letterSpacing: "-0.03em" }}>
                  The Copy Paste Loop
                </h3>
                <p style={{ fontSize: "1.02rem", color: "#57534e", lineHeight: 1.65 }}>
                  You find the perfect role or client. But customizing your pitch means re-explaining your experience to ChatGPT 10 times, only for it to hallucinate stale skills or generic fluff.
                </p>
              </div>

              {/* Mockup 1: Confused Alert */}
              <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <div style={{
                  width: "100%",
                  maxWidth: "480px",
                  height: "260px",
                  borderRadius: "20px",
                  background: "#fffefb",
                  border: "2px solid #181616",
                  boxShadow: "8px 8px 0px #181616",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0eee6", paddingBottom: "10px" }}>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#991b1b" }}>LLM RE-PROMPT LOOP</span>
                    <span style={{ fontSize: "0.75rem", color: "#991b1b", fontFamily: "var(--font-mono)", fontWeight: 700 }}>UNSYNCED</span>
                  </div>

                  <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", padding: "14px 18px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#991b1b", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>Confused Prompt Context</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#7f1d1d", lineHeight: 1.45 }}>
                      "Wait, did you lead Rust migrations or React frontends? Re-prompting assistant..."
                    </div>
                  </div>

                  <div style={{ background: "#fff", border: "1px solid #e7e4dc", padding: "10px 14px", borderRadius: "10px", fontSize: "0.78rem", color: "#a8a29e" }}>
                    Result: Generic copy, stale project stats, 2 hours wasted.
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Row 2: Left Animated Mockup / Right Text */}
          <ScrollReveal delayMs={150}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" }}>

              {/* Mockup 2: MCP Single Source of Truth */}
              <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", order: 1 }}>
                <div style={{
                  width: "100%",
                  maxWidth: "480px",
                  height: "260px",
                  borderRadius: "20px",
                  background: "#fffefb",
                  border: "2px solid #181616",
                  boxShadow: "8px 8px 0px #fed743",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0eee6", paddingBottom: "10px" }}>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#065f46" }}>MCP SERVER ACTIVE</span>
                    <span style={{ fontSize: "0.75rem", color: "#10b981", fontFamily: "var(--font-mono)", fontWeight: 700 }}>ONLINE</span>
                  </div>

                  <div style={{ background: "#ecfdf5", border: "1.5px solid #6ee7b7", padding: "14px 18px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#065f46", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>✓</span>
                      <span>Identity Graph</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#047857", lineHeight: 1.45 }}>
                      Next.js, Node.js, Supabase, 99.99% Uptime Metrics.
                    </div>
                  </div>

                  <div style={{ background: "#181616", color: "#ffffff", padding: "10px 14px", borderRadius: "10px", fontSize: "0.78rem" }}>
                    ✓ AI knows your real achievements before you even type.
                  </div>
                </div>
              </div>

              {/* Right Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "520px", order: 2 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, color: "#047857", letterSpacing: "0.08em" }}>
                  02 / THE SOLUTION
                </span>
                <h3 style={{ fontSize: "clamp(1.75rem, 2.8vw, 2.3rem)", fontWeight: 800, color: "#181616", lineHeight: 1.18, letterSpacing: "-0.03em" }}>
                  Instant Context, Zero Reminders
                </h3>
                <p style={{ fontSize: "1.02rem", color: "#57534e", lineHeight: 1.65 }}>
                  IdentityGraph maintains a live, single-source-of-truth graph of your real achievements, tech stack, and project stats. Your AI assistant knows who you are before you even type.
                </p>
              </div>

            </div>
          </ScrollReveal>

          {/* Row 3: Left Text / Right Animated Mockup */}
          <ScrollReveal delayMs={200}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "520px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.08em" }}>
                  03 / THE WIN
                </span>
                <h3 style={{ fontSize: "clamp(1.75rem, 2.8vw, 2.3rem)", fontWeight: 800, color: "#181616", lineHeight: 1.18, letterSpacing: "-0.03em" }}>
                  Tailored Pitches in 10 Seconds
                </h3>
                <p style={{ fontSize: "1.02rem", color: "#57534e", lineHeight: 1.65 }}>
                  Paste any Job Description or client brief. IdentityGraph maps your career experience directly to their exact requirements — outputting high-conversion pitches instantly.
                </p>
              </div>

              {/* Mockup 3: 98% Match Output */}
              <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <div style={{
                  width: "100%",
                  maxWidth: "480px",
                  height: "260px",
                  borderRadius: "20px",
                  background: "#fffefb",
                  border: "2px solid #181616",
                  boxShadow: "8px 8px 0px #181616",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0eee6", paddingBottom: "10px" }}>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#7c3aed" }}>AUTOMATED MATCH</span>
                    <span style={{ fontSize: "0.8rem", background: "#f3e8ff", color: "#6b21a8", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>98% Match</span>
                  </div>

                  <div style={{ background: "#faf8f2", border: "1px solid #e7e4dc", padding: "14px 18px", borderRadius: "12px", fontSize: "0.8rem", color: "#181616", lineHeight: 1.45 }}>
                    "Hi Team, matching your Job Brief requirements: 5+ years Next.js, 500k req/day scaling experience."
                  </div>

                  <div style={{ background: "#fed743", color: "#181616", border: "1.5px solid #181616", padding: "10px 14px", borderRadius: "10px", fontSize: "0.8rem", fontWeight: 800, textAlign: "center" }}>
                    Pitch Generated &amp; Ready to Send
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}

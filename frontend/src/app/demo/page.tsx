"use client";

import { useState } from "react";
import Link from "next/link";

export default function DemoPage() {
  const [testUsername, setTestUsername] = useState("johndoe");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Dynamic Base URLs using process.env or window origin fallback
  const appOrigin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const backendOrigin = apiBase.replace(/\/api\/?$/, "");

  const rawDataUrl = `${appOrigin}/portfolio/${testUsername}/rawdata`;
  const mcpSseUrl = `${backendOrigin}/api/mcp/sse?username=<your-username>`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    toolCall?: string;
    pdfDownload?: { fileName: string; size: string };
  }

  const PRESET_EXAMPLES = [
    {
      id: "cold-email",
      label: "Draft Cold Email",
      messages: [
        {
          role: "user" as const,
          content: "Using my IdentityGraph schema, write a cold outreach email for a Senior Backend Role."
        },
        {
          role: "assistant" as const,
          toolCall: `MCP Tool: get_identity_schema(username="${testUsername}")`,
          content: `Subject: Senior Backend Role - Scaled MCP Pipeline to 500k+ req/day\n\nHi Hiring Team,\n\nI'm reaching out regarding Senior Backend Engineering opportunities. I've connected my IdentityGraph schema (${rawDataUrl}).\n\nKey achievements from my career graph:\n- IdentityGraph MCP Server: Handled 500k+ API requests/day with 99.99% operational uptime\n- Core Stack: TypeScript, Next.js, Node.js, Supabase, System Design\n\nYou can review my complete portfolio at: http://localhost:3000/portfolio/${testUsername}\n\nBest regards,\nJohn Doe`
        }
      ]
    },
    {
      id: "jd-match-resume",
      label: "JD Match & Tailored Resume",
      messages: [
        {
          role: "user" as const,
          content: "Here is the JD: https://careers.techcorp.com/jobs/senior-backend-lead. Tell me my JD match score and give me areas to align my profile more with this position."
        },
        {
          role: "assistant" as const,
          toolCall: `MCP Tool: get_identity_schema(username="${testUsername}") & fetch_jd(url="careers.techcorp.com")`,
          content: `Match Analysis for Senior Backend Lead:\n\n• Overall JD Match Score: 94% (High Fit)\n• Matching Skills: TypeScript, Node.js, Supabase, System Design (500k+ req/day)\n\nAreas to Align Your Profile:\n1. Highlight Distributed Caching: Add Redis/Memcached experience to your skills graph.\n2. Emphasize Team Leadership: Specify team size (e.g., led 4 engineers) under your IdentityGraph Experience section.`
        },
        {
          role: "user" as const,
          content: "Generate a tailored 1-page resume in PDF based on this JD match."
        },
        {
          role: "assistant" as const,
          toolCall: `MCP Tool: generate_resume_pdf(username="${testUsername}", format="pdf") → Created resume.pdf`,
          content: `Sure! Here is your tailored resume:`,
          pdfDownload: {
            fileName: "resume.pdf",
            size: "142 KB"
          }
        }
      ]
    }
  ];

  const [activeExampleId, setActiveExampleId] = useState<string>(PRESET_EXAMPLES[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(PRESET_EXAMPLES[0].messages);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSelectExample = (example: typeof PRESET_EXAMPLES[0]) => {
    if (isSimulating) return;
    setActiveExampleId(example.id);
    setIsSimulating(true);

    setMessages([example.messages[0]]);

    setTimeout(() => {
      setMessages(example.messages);
      setIsSimulating(false);
    }, 300);
  };

  const mcpConfigSnippet = `{
  "mcpServers": {
    "identitygraph": {
      "url": "${mcpSseUrl}"
    }
  }
}`;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fbf9f4", color: "#181616" }}>

      {/* Top Navigation Bar */}
      <header style={{ width: "100%", background: "transparent" }}>
        <div className="header-container">
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href="/" className="brand-title">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                <circle cx="18" cy="6" r="2.5" fill="currentColor" />
                <circle cx="12" cy="18" r="2.5" fill="currentColor" />
                <line x1="8.2" y1="6" x2="15.8" y2="6" />
                <line x1="7.5" y1="8" x2="10.8" y2="16" />
                <line x1="16.5" y1="8" x2="13.2" y2="16" />
              </svg>
              <span>IdentityGraph</span>
            </Link>
          </div>

          <div>
            <Link href="/login" className="btn-login-link">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "40px 32px 100px 32px", display: "flex", flexDirection: "column", gap: "50px" }}>

        {/* Hero Title */}
        <div style={{ textAlign: "center", maxWidth: "740px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#181616", lineHeight: 1.15, letterSpacing: "-0.035em" }}>
            Example Portfolio
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#68686e", lineHeight: 1.6 }}>
            Preview a pre-seeded portfolio and connect context directly to Cursor, Claude, and ChatGPT via native MCP.
          </p>
        </div>

        {/* Section 1: John Doe's Basic Portfolio Preview Card */}
        <div style={{
          background: "#ffffff",
          border: "1.5px solid #e7e4dc",
          borderRadius: "28px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.015)"
        }}>
          {/* Portfolio Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#181616" }}>John Doe</h2>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#78716c", background: "#fbf9f4", padding: "2px 10px", borderRadius: "6px", border: "1px solid #e7e4dc" }}>
                  @{testUsername}
                </span>
              </div>
              <p style={{ fontSize: "1rem", color: "#44403c", fontWeight: 600 }}>
                Senior Full Stack Engineer &amp; Open Source Contributor
              </p>
            </div>

            <Link href={`/portfolio/${testUsername}`} className="btn-yellow-pill" style={{ padding: "12px 24px", fontSize: "0.92rem" }}>
              <span>View Full Web Portfolio Page</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="2,1 9,5 2,9" />
              </svg>
            </Link>
          </div>

          {/* Bio */}
          <div style={{ padding: "18px 20px", background: "#fbf9f4", borderRadius: "14px", border: "1px solid #ece9df", fontSize: "0.95rem", color: "#57534e", lineHeight: 1.6 }}>
            "Passionate developer with 6+ years building high-concurrency backend services, distributed systems, and real-time MCP servers. Lead architect for IdentityGraph's zero-downtime database pipeline."
          </div>

          {/* Skills Grid */}
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              SKILLS
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["TypeScript", "Next.js", "Node.js", "Supabase", "MCP Protocol", "System Design", "Docker", "PostgreSQL"].map((skill) => (
                <span key={skill} style={{ fontSize: "0.85rem", fontWeight: 600, background: "#ffffff", border: "1.5px solid #181616", padding: "6px 14px", borderRadius: "8px", color: "#181616" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Project */}
          <div style={{ paddingTop: "20px", borderTop: "1px dashed #e7e4dc" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              FEATURED PROJECT
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e7e4dc", padding: "18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#181616", marginBottom: "4px" }}>IdentityGraph MCP Server</div>
                <div style={{ fontSize: "0.88rem", color: "#68686e" }}>Exposes developer credentials to Cursor, Claude Desktop, and local LLM environments.</div>
              </div>
              <span style={{ fontSize: "0.82rem", color: "#57534e", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                500k+ API Requests • 99.99% Uptime
              </span>
            </div>
          </div>
        </div>

        {/* Built-in Chatbot Simulator Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Header Info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#181616" }}>
                Interactive MCP AI Chatbot Simulator
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#68686e", marginTop: "2px" }}>
                Select a preset example prompt or type custom queries to test live AI responses powered by IdentityGraph:
              </p>
            </div>
          </div>

          {/* Preset Example Buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {PRESET_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSelectExample(ex)}
                disabled={isSimulating}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #181616",
                  background: activeExampleId === ex.id ? "#181616" : "#ffffff",
                  color: activeExampleId === ex.id ? "#ffffff" : "#181616",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: isSimulating ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: activeExampleId === ex.id ? "3px 3px 0px #fed743" : "none"
                }}
              >
                ▶ {ex.label}
              </button>
            ))}
          </div>

          {/* Chat Window Container */}
          <div style={{
            background: "#ffffff",
            border: "1.5px solid #181616",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "6px 6px 0px #181616"
          }}>
            {/* Terminal Top Bar */}
            <div style={{ background: "#181616", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#ffffff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", fontWeight: 700, marginLeft: "8px", color: "#fed743" }}>
                  IDENTITYGRAPH MCP AI AGENT (CLAUDE / CURSOR)
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#a1a1aa" }}>
                @{testUsername}
              </span>
            </div>

            {/* Messages Feed */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", maxHeight: "460px", overflowY: "auto", background: "#fbf9f4" }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: "6px" }}>
                  
                  {/* Sender Badge */}
                  <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#78716c", fontWeight: 700 }}>
                    {msg.role === "user" ? "YOU (PROMPT)" : "AI ASSISTANT (CONNECTED TO MCP)"}
                  </div>

                  {/* Tool Call Badge if Assistant */}
                  {msg.role === "assistant" && msg.toolCall && (
                    <div style={{ background: "#181616", color: "#6ee7b7", padding: "6px 12px", borderRadius: "8px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600 }}>
                      ⚡ {msg.toolCall}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: "85%",
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: msg.role === "user" ? "#181616" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#181616",
                    border: msg.role === "user" ? "none" : "1.5px solid #e7e4dc",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    boxShadow: msg.role === "user" ? "none" : "0 2px 8px rgba(0,0,0,0.03)"
                  }}>
                    <div>{msg.content}</div>

                    {msg.pdfDownload && (
                      <div style={{ marginTop: "12px", background: "#fbf9f4", border: "1px solid #ece9df", padding: "10px 14px", borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ef4444" }}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <line x1="9" y1="15" x2="12" y2="18" />
                          <line x1="15" y1="15" x2="12" y2="18" />
                        </svg>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#181616", fontFamily: "var(--font-mono)" }}>
                          {msg.pdfDownload.fileName} ({msg.pdfDownload.size})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSimulating && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", color: "#78716c", fontFamily: "var(--font-mono)" }}>
                  <span>⚡</span> Querying IdentityGraph MCP Server...
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom End-of-Page CTA Card */}
        <div style={{
          background: "#ffffff",
          border: "1.5px solid #181616",
          borderRadius: "24px",
          padding: "44px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
          boxShadow: "6px 6px 0px #181616",
          marginTop: "10px"
        }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#181616", letterSpacing: "-0.03em" }}>
            Ready to build your IdentityGraph?
          </h2>
          <p style={{ fontSize: "1rem", color: "#68686e", maxWidth: "520px", lineHeight: 1.6 }}>
            Create your developer portfolio in minutes and connect your live career context directly to Cursor, Claude, and ChatGPT.
          </p>
          <div style={{ marginTop: "6px" }}>
            <Link href="/login" className="btn-yellow-pill" style={{ padding: "14px 32px", fontSize: "0.98rem" }}>
              <span>Get Started Free</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="2,1 9,5 2,9" />
              </svg>
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(24, 22, 22, 0.08)", padding: "24px 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", fontSize: "0.85rem", color: "#78716c", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p>© 2026 IdentityGraph. Built with Next.js & Supabase.</p>
          <Link href="/" style={{ color: "#181616", textDecoration: "none", fontWeight: 600 }}>Back to Landing Page</Link>
        </div>
      </footer>
    </div>
  );
}

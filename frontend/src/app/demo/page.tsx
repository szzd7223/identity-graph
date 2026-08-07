"use client";

import { useState } from "react";
import Link from "next/link";

export default function DemoPage() {
  const [testUsername, setTestUsername] = useState("johndoe");
  const [activeTab, setActiveTab] = useState<"mcp" | "web">("web");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState(`Read my verified portfolio schema at http://localhost:3000/portfolio/${testUsername}/rawdata and write a cold email for a Senior Backend role.`);
  const [generatedPitch, setGeneratedPitch] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const rawDataUrl = `http://localhost:3000/portfolio/${testUsername}/rawdata`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mcpConfigSnippet = `{
  "mcpServers": {
    "identitygraph": {
      "command": "npx",
      "args": ["-y", "@identitygraph/mcp-server", "--username", "${testUsername}"]
    }
  }
}`;

  const handleTestPrompt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPitch(
        `[AI Web Response - Context Fetched from /portfolio/${testUsername}/rawdata]\n\nSubject: Senior Backend Role - Verified 99.99% Uptime Track Record\n\nHi Team,\n\nI reviewed John Doe's verified identity schema from ${rawDataUrl}.\n\nJohn Doe is a Senior Full Stack Engineer with 6+ years building high-concurrency backend services. Key achievements fetched directly from his IdentityGraph schema:\n- IdentityGraph MCP Server: 500k+ API requests/day with 99.99% uptime\n- Verified Core Stack: TypeScript, Next.js, Node.js, Supabase, System Design\n\nFull portfolio schema: http://localhost:3000/portfolio/${testUsername}\n\nBest,\nJohn Doe`
      );
      setIsGenerating(false);
    }, 600);
  };

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
            <Link href="/" style={{ fontSize: "0.85rem", color: "#78716c", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
              ← Back to Home
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
          <div style={{ display: "inline-flex", alignSelf: "center", padding: "4px 14px", border: "1px solid #d6d3c9", borderRadius: "9999px", background: "#ffffff", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#57534e", fontWeight: 600 }}>
            ● LIVE DEMO & AI HUB
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#181616", lineHeight: 1.15, letterSpacing: "-0.035em" }}>
            John Doe's Portfolio & AI Integration
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#68686e", lineHeight: 1.6 }}>
            Preview John Doe's pre-seeded portfolio and test two seamless ways to connect his verified context: via URL fetching for Web AI tools or native MCP for local IDEs.
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
                Senior Full Stack Engineer & Open Source Contributor
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

          {/* Verified Skills Grid */}
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              VERIFIED SKILLS
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
                <div style={{ fontSize: "0.88rem", color: "#68686e" }}>Exposes verified developer credentials to Cursor, Claude Desktop, and local LLM environments.</div>
              </div>
              <span style={{ fontSize: "0.78rem", background: "#d1fae5", color: "#065f46", padding: "4px 12px", borderRadius: "6px", fontWeight: 700 }}>
                500k+ API Requests • 99.99% Uptime
              </span>
            </div>
          </div>

          {/* Interactive Sandbox Lookup Bar */}
          <div style={{ paddingTop: "20px", borderTop: "1px dashed #e7e4dc", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#181616" }}>Test Sandbox Lookup:</div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, maxWidth: "400px" }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "#78716c", fontWeight: 700 }}>@</span>
              <input
                type="text"
                className="form-input"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="username"
                style={{ borderRadius: "8px", height: "42px", background: "#ffffff", borderColor: "#181616", fontWeight: 600 }}
              />
              <Link href={`/portfolio/${testUsername}`} className="btn-secondary" style={{ whiteSpace: "nowrap", height: "42px", borderRadius: "8px", borderColor: "#181616", color: "#181616", fontWeight: 600 }}>
                Load Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Mode Switcher Tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* Mode Switcher Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", borderBottom: "1px solid #e7e4dc", paddingBottom: "16px" }}>
            <button
              onClick={() => setActiveTab("web")}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "1.5px solid #181616",
                background: activeTab === "web" ? "#181616" : "#ffffff",
                color: activeTab === "web" ? "#ffffff" : "#181616",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: activeTab === "web" ? "3px 3px 0px #fed743" : "none"
              }}
            >
              🌐 Method 1: AI Web URL Fetching (`/rawdata`)
            </button>
            <button
              onClick={() => setActiveTab("mcp")}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "1.5px solid #181616",
                background: activeTab === "mcp" ? "#181616" : "#ffffff",
                color: activeTab === "mcp" ? "#ffffff" : "#181616",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: activeTab === "mcp" ? "3px 3px 0px #fed743" : "none"
              }}
            >
              ⚡ Method 2: Native MCP Mode (Cursor & IDEs)
            </button>
          </div>

          {/* TAB 1: AI Web URL Fetching (/rawdata) */}
          {activeTab === "web" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: "#dbeafe", border: "1px solid #bfdbfe", padding: "16px 20px", borderRadius: "14px", fontSize: "0.92rem", color: "#1e40af", lineHeight: 1.5 }}>
                💡 <strong>Zero Copy-Pasting Needed:</strong> Every portfolio generates a clean raw JSON endpoint (`/portfolio/username/rawdata`). Give this URL to ChatGPT Web, Claude, or Perplexity, and the AI automatically fetches your verified context to craft prompts!
              </div>

              {/* Step 1: Raw AI URL Endpoint */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#181616", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 10px", borderRadius: "6px", fontSize: "0.9rem" }}>AI RAW ENDPOINT</span>
                      <span>Public Raw Data URL for AI Tools</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#68686e", marginTop: "4px" }}>Returns clean, unformatted JSON schema optimized for AI web fetching.</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => copyToClipboard(rawDataUrl, "rawUrl")}
                      className="btn-yellow-pill"
                      style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      <span>{copiedKey === "rawUrl" ? "✓ Copied!" : "📋 Copy AI URL"}</span>
                    </button>
                    <a 
                      href={rawDataUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: "8px 16px", fontSize: "0.85rem", textDecoration: "none" }}
                    >
                      Open Raw JSON ↗
                    </a>
                  </div>
                </div>

                <div style={{ background: "#181616", color: "#93c5fd", padding: "14px 18px", borderRadius: "10px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600 }}>
                  {rawDataUrl}
                </div>
              </div>

              {/* Step 2 & 3: Prompt Web AI Playground */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#181616" }}>Test AI Prompting with URL Context</h3>
                  <p style={{ fontSize: "0.88rem", color: "#68686e", marginTop: "2px" }}>Enter a prompt referencing the raw data URL to see how web AI assistants parse your context:</p>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    className="form-input"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    style={{ flex: 1, minWidth: "280px", borderRadius: "8px", height: "44px", background: "#fbf9f4" }}
                  />
                  <button 
                    onClick={handleTestPrompt} 
                    className="btn-pill"
                    style={{ height: "44px", padding: "0 20px" }}
                    disabled={isGenerating}
                  >
                    <span>{isGenerating ? "Fetching..." : "Test Web AI Pitch ▶"}</span>
                  </button>
                </div>

                {generatedPitch && (
                  <div style={{ background: "#181616", color: "#fed743", border: "1.5px solid #181616", padding: "18px", borderRadius: "14px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {generatedPitch}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Native MCP Mode */}
          {activeTab === "mcp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "16px 20px", borderRadius: "14px", fontSize: "0.92rem", color: "#92400e", lineHeight: 1.5 }}>
                💡 <strong>How MCP Works:</strong> The local stdio server or remote SSE connector runs in the background. When you prompt Cursor, Claude Desktop, or Windsurf, the AI automatically queries your schema without manual copy-pasting.
              </div>

              {/* MCP Step 1: Stdio Command */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#181616", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: "#ffedd5", color: "#c2410c", padding: "2px 10px", borderRadius: "6px", fontSize: "0.9rem" }}>STDIO CLI</span>
                    <span>Option A: Run Stdio MCP Server</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`npx @identitygraph/mcp-server --username ${testUsername}`, "cmd")}
                    className="btn-secondary"
                    style={{ padding: "6px 14px", fontSize: "0.78rem", borderRadius: "6px" }}
                  >
                    {copiedKey === "cmd" ? "✓ Copied!" : "Copy Command"}
                  </button>
                </div>
                <div style={{ background: "#181616", color: "#fed743", padding: "14px 18px", borderRadius: "10px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600 }}>
                  $ npx @identitygraph/mcp-server --username {testUsername}
                </div>
              </div>

              {/* MCP Step 2: IDE Config JSON */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#181616", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: "#fce7f3", color: "#be185d", padding: "2px 10px", borderRadius: "6px", fontSize: "0.9rem" }}>CONFIG JSON</span>
                    <span>Option B: Add to Cursor / Claude Desktop / Windsurf</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(mcpConfigSnippet, "json")}
                    className="btn-secondary"
                    style={{ padding: "6px 14px", fontSize: "0.78rem", borderRadius: "6px" }}
                  >
                    {copiedKey === "json" ? "✓ Copied!" : "Copy JSON"}
                  </button>
                </div>
                <pre style={{ background: "#181616", color: "#6ee7b7", padding: "16px 18px", borderRadius: "10px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", overflowX: "auto" }}>
                  {mcpConfigSnippet}
                </pre>
              </div>

              {/* MCP Step 3: Remote SSE Connector */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#181616", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: "#d1fae5", color: "#047857", padding: "2px 10px", borderRadius: "6px", fontSize: "0.9rem" }}>SSE CONNECTOR</span>
                    <span>Option C: Remote Web SSE Connector URL</span>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`http://localhost:3001/api/mcp/sse?username=${testUsername}`, "sse")}
                    className="btn-secondary"
                    style={{ padding: "6px 14px", fontSize: "0.78rem", borderRadius: "6px" }}
                  >
                    {copiedKey === "sse" ? "✓ Copied!" : "Copy URL"}
                  </button>
                </div>
                <div style={{ background: "#181616", color: "#93c5fd", padding: "14px 18px", borderRadius: "10px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600 }}>
                  http://localhost:3001/api/mcp/sse?username={testUsername}
                </div>
              </div>
            </div>
          )}

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

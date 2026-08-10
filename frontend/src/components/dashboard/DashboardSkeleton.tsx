"use client";

import { useState } from "react";
import Link from "next/link";
import { Profile } from "../../services/api";

export type DashboardTab = "overview" | "experiences" | "education" | "projects" | "skills";

interface DashboardSkeletonProps {
  profile: Profile;
  username: string;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSignOut: () => void;
  children: React.ReactNode;
}

export function DashboardSkeleton({
  profile,
  username,
  activeTab,
  onTabChange,
  onSignOut,
  children,
}: DashboardSkeletonProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const portfolioUrl = `http://localhost:3000/portfolio/${username}`;
  const rawDataUrl = `http://localhost:3000/portfolio/${username}/rawdata`;
  const mcpSseUrl = `http://localhost:3001/api/mcp/sse`;
  const mcpSseConfig = JSON.stringify({
    servers: {
      "identity-graph": {
        type: "sse",
        url: mcpSseUrl
      }
    }
  }, null, 2);
  const chatGptContext = `Remember these profile details

Name: ${profile.fullName || username}

Title: ${profile.title || "Builder"}

Bio: ${profile.bio || "No bio set yet"}

Portfolio Data Endpoint (JSON): ${rawDataUrl}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems: { id: DashboardTab; label: string }[] = [
    { id: "overview", label: "Overview & Bio" },
    { id: "experiences", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects & Pursuits" },
    { id: "skills", label: "Skills & Competencies" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fbf9f4", color: "#181616" }}>
      
      {/* Top Navigation Header */}
      <header style={{ width: "100%", background: "#ffffff", borderBottom: "1.5px solid #e7e4dc", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Logo & Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/" className="brand-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                <circle cx="18" cy="6" r="2.5" fill="currentColor" />
                <circle cx="12" cy="18" r="2.5" fill="currentColor" />
                <line x1="8.2" y1="6" x2="15.8" y2="6" />
                <line x1="7.5" y1="8" x2="10.8" y2="16" />
                <line x1="16.5" y1="8" x2="13.2" y2="16" />
              </svg>
              <span>IdentityGraph Studio</span>
            </Link>
          </div>

          {/* Action Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href={`/portfolio/${username}`} target="_blank" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>View Public Portfolio</span>
              <span style={{ fontSize: "0.75rem" }}>↗</span>
            </Link>

            <button onClick={onSignOut} className="btn-login-link" style={{ fontSize: "0.85rem", color: "#991b1b" }}>
              Log Out
            </button>
          </div>

        </div>
      </header>

      {/* Main 2-Column Studio Container */}
      <main style={{ flex: 1, maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "36px 32px 80px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px", alignItems: "start" }}>
          
          {/* LEFT COLUMN: Identity Control Center */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            
            {/* 1. Profile Identity Badge Card */}
            <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "4px", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#181616", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile.fullName || username}
              </h3>
              <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", color: "#78716c" }}>
                @{username}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#57534e", fontWeight: 600, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile.title || "Builder & Developer"}
              </span>
            </div>

            {/* 2. Completion Score Card */}
            <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", fontWeight: 700 }}>
                <span style={{ color: "#181616" }}>Profile Completion</span>
                <span style={{ color: "#047857", fontFamily: "var(--font-mono)" }}>85% Complete</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#f0eee6", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ width: "85%", height: "100%", background: "#fed743", borderRadius: "9999px" }} />
              </div>
              <div style={{ fontSize: "0.78rem", color: "#78716c" }}>
                Tip: Add 1 more project to hit 100% identity accuracy.
              </div>
            </div>

            {/* 3. Instant AI Context Actions Card */}
            <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                INSTANT AI ACTIONS
              </div>

              <button 
                onClick={() => copyToClipboard(chatGptContext, "chatgpt")}
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start", padding: "10px 14px", fontSize: "0.82rem", borderRadius: "10px" }}
              >
                <span>{copiedKey === "chatgpt" ? "Copied Prompt!" : "Copy AI Context Prompt"}</span>
              </button>

              <button 
                onClick={() => copyToClipboard(mcpSseConfig, "mcp")}
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start", padding: "10px 14px", fontSize: "0.82rem", borderRadius: "10px" }}
              >
                <span>{copiedKey === "mcp" ? "Copied MCP Config!" : "Copy MCP Server Config"}</span>
              </button>

              <button 
                onClick={() => copyToClipboard(portfolioUrl, "url")}
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start", padding: "10px 14px", fontSize: "0.82rem", borderRadius: "10px" }}
              >
                <span>{copiedKey === "url" ? "Copied Portfolio URL!" : "Copy Portfolio Link"}</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Unified Single Card Builder Workspace Container */}
          <div style={{ 
            background: "#ffffff", 
            border: "1.5px solid #e7e4dc", 
            borderRadius: "24px", 
            padding: "32px", 
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.015)",
            width: "100%"
          }}>
            {/* Sticky Top Horizontal Workspace Navigation Tabs */}
            <div style={{ 
              position: "sticky",
              top: "70px",
              zIndex: 10,
              background: "#ffffff",
              paddingTop: "6px",
              paddingBottom: "18px",
              borderBottom: "1.5px solid #e7e4dc",
              display: "flex", 
              alignItems: "center", 
              gap: "10px", 
              overflowX: "auto",
              scrollbarWidth: "none"
            }}>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      const el = document.getElementById(`section-${item.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "100px",
                      border: isActive ? "1.5px solid #181616" : "1.5px solid #e7e4dc",
                      background: isActive ? "#181616" : "#ffffff",
                      color: isActive ? "#ffffff" : "#57534e",
                      fontWeight: isActive ? 700 : 600,
                      fontSize: "0.86rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                      boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Render Tab Components Inside The Unified Workspace Card */}
            {children}
          </div>

        </div>
      </main>

    </div>
  );
}

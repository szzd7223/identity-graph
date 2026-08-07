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
  const mcpCommand = `npx @identitygraph/mcp-server --username ${username}`;
  const chatGptContext = `[IDENTITYGRAPH CONTEXT: ${username.toUpperCase()}]
Name: ${profile.fullName || username}
Title: ${profile.title || "Builder"}
Bio: ${profile.bio || "No bio set yet"}
Portfolio: ${portfolioUrl}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems: { id: DashboardTab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview & Bio", icon: "👤" },
    { id: "experiences", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "projects", label: "Projects & Pursuits", icon: "⚡" },
    { id: "skills", label: "Skills & Competencies", icon: "📈" },
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

            {/* Status Pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#ecfdf5", border: "1px solid #6ee7b7", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", color: "#047857", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              <span className="animate-pulse-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <span>MCP & API SYNCED</span>
            </div>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", alignItems: "start" }}>
          
          {/* LEFT COLUMN: Identity Control Center */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "340px", width: "100%" }}>
            
            {/* 1. Profile Identity Badge Card */}
            <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "24px", display: "flex", gap: "16px", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#181616", color: "#fed743", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.3rem" }}>
                {(profile.fullName || username).charAt(0).toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#181616", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {profile.fullName || username}
                </h3>
                <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", color: "#78716c" }}>
                  @{username}
                </span>
                <span style={{ fontSize: "0.82rem", color: "#57534e", fontWeight: 600, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {profile.title || "Builder & Developer"}
                </span>
              </div>
            </div>

            {/* 2. Graph Completion Score Card */}
            <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem", fontWeight: 700 }}>
                <span style={{ color: "#181616" }}>Graph Completion</span>
                <span style={{ color: "#047857", fontFamily: "var(--font-mono)" }}>85% Complete</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#f0eee6", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ width: "85%", height: "100%", background: "#fed743", borderRadius: "9999px" }} />
              </div>
              <div style={{ fontSize: "0.78rem", color: "#78716c" }}>
                💡 Tip: Add 1 more project to hit 100% identity accuracy.
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
                <span>📋</span>
                <span>{copiedKey === "chatgpt" ? "Copied to Clipboard!" : "Copy ChatGPT Context"}</span>
              </button>

              <button 
                onClick={() => copyToClipboard(mcpCommand, "mcp")}
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start", padding: "10px 14px", fontSize: "0.82rem", borderRadius: "10px" }}
              >
                <span>⚡</span>
                <span>{copiedKey === "mcp" ? "Copied Stdio Command!" : "Copy MCP Stdio Cmd"}</span>
              </button>

              <button 
                onClick={() => copyToClipboard(portfolioUrl, "url")}
                className="btn-secondary"
                style={{ width: "100%", justifyContent: "flex-start", padding: "10px 14px", fontSize: "0.82rem", borderRadius: "10px" }}
              >
                <span>🌐</span>
                <span>{copiedKey === "url" ? "Copied Portfolio URL!" : "Copy Portfolio Link"}</span>
              </button>
            </div>

            {/* 4. Sidebar Navigation Tabs */}
            <div style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: isActive ? "1.5px solid #181616" : "1.5px solid transparent",
                      background: isActive ? "#181616" : "transparent",
                      color: isActive ? "#ffffff" : "#57534e",
                      fontWeight: isActive ? 700 : 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      boxShadow: isActive ? "3px 3px 0px #fed743" : "none"
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Builder Workspace Container Skeleton */}
          <div style={{ 
            background: "#ffffff", 
            border: "1.5px solid #e7e4dc", 
            borderRadius: "24px", 
            padding: "36px", 
            minHeight: "560px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.015)",
            flex: 1
          }}>
            {/* Render Tab Form Component Children */}
            {children}
          </div>

        </div>
      </main>

    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState("johndoe");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center", alignItems: "center", padding: "40px" }}>
      <main className="glass-panel glow-accent" style={{ padding: "50px", maxWidth: "650px", width: "100%", textAlign: "center", textRendering: "optimizeLegibility" }}>
        
        {/* Logo Icon Mock */}
        <div style={{ display: "inline-flex", width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, var(--primary-start), var(--accent))", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "#fff", fontWeight: "800", marginBottom: "25px", boxShadow: "0 8px 30px rgba(114, 46, 209, 0.4)" }}>
          I
        </div>

        <h1 style={{ fontSize: "2.75rem", marginBottom: "15px", background: "linear-gradient(135deg, #fff 40%, var(--primary-end) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          IdentityGraph
        </h1>

        <p style={{ color: "var(--muted-foreground)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "40px" }}>
          Build, customize, and manage your professional career details. 
          Enables beautiful responsive web layouts and powers local AI assistants with verified context via Model Context Protocol.
        </p>

        {/* Input Profile Form Card */}
        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "12px", padding: "25px", marginBottom: "35px", textAlign: "left" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--muted-foreground)", display: "block", marginBottom: "10px" }}>
            ENTER DEVELOPER USERNAME TO TEST
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", fontWeight: "600", fontSize: "0.95rem" }}>
                @
              </span>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "32px", fontSize: "0.95rem", fontWeight: "600" }}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="username"
              />
            </div>
            <Link 
              href={`/dashboard?username=${username}`}
              className="btn-primary"
              style={{ fontSize: "0.9rem", padding: "0 24px", textDecoration: "none" }}
            >
              Enter Dashboard
            </Link>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "10px" }}>
            Tip: Try the seeded profile name <strong>&apos;johndoe&apos;</strong> to see preloaded data immediately!
          </p>
        </div>

        {/* Action Grid */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <Link
            href={`/portfolio/${username}`}
            className="btn-secondary"
            style={{ flex: 1, textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", gap: "8px" }}
          >
            🎨 View Portfolio Theme
          </Link>
          <a
            href="http://localhost:3001/api/profiles/johndoe"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ flex: 1, textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", gap: "8px" }}
          >
            🔌 View JSON REST API
          </a>
        </div>

      </main>

      {/* Footer Info */}
      <footer style={{ marginTop: "40px", fontSize: "0.8rem", color: "var(--muted-foreground)", display: "flex", gap: "20px" }}>
        <span>Backend API: localhost:3001</span>
        <span>•</span>
        <span>MCP Server: stdio mode</span>
        <span>•</span>
        <span>Supabase Sync: Active</span>
      </footer>
    </div>
  );
}

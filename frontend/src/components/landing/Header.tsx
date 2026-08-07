"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

export function Header() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      setLoading(false);
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      });
      return () => subscription.unsubscribe();
    };
    checkAuth();
  }, []);

  return (
    <header style={{ width: "100%", background: "transparent" }}>
      <div className="header-container">
        {/* Brand logo & title */}
        <Link href="/" className="brand-title">
          {/* Generic Graph SVG Icon */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--color-text)" }}
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

        {/* Navigation placeholder skipped as requested */}

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {loading ? (
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              ...
            </span>
          ) : session ? (
            <Link href="/dashboard" className="btn-login-link">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-login-link">
              Log in
            </Link>
          )}

          <a href="#demo" className="btn-pill">
            <span>See it in action</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="2,1 9,5 2,9" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

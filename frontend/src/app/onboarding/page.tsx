"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileSetupForm } from "../../components/dashboard/ProfileSetupForm";
import { StatusBar } from "../../components/ui/StatusBar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { session, loading: authLoading, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCreated = () => {
    showStatus("Profile created successfully!");
    setTimeout(() => {
      router.replace("/dashboard");
    }, 800);
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fbf9f4", color: "#181616" }}>
      
      {/* Top Header */}
      <header style={{ width: "100%", background: "transparent", padding: "20px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <StatusBar statusMessage={statusMessage} error={error} onDismissError={() => setError(null)} />
            {session && (
              <button onClick={signOut} className="btn-login-link" style={{ fontSize: "0.85rem", color: "#991b1b" }}>
                Log Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Centered Wizard Content */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <ProfileSetupForm onCreated={handleCreated} setError={setError} showStatus={showStatus} />
      </main>

      {/* Footer */}
      <footer style={{ padding: "24px 32px", textAlign: "center", fontSize: "0.85rem", color: "#78716c" }}>
        <p>© 2026 IdentityGraph. Built with Next.js & Supabase.</p>
      </footer>
    </div>
  );
}

"use client";

import React from "react";

interface StatusBarProps {
  statusMessage: string | null;
  error: string | null;
  onDismissError: () => void;
}

export function StatusBar({ statusMessage, error, onDismissError }: StatusBarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {statusMessage && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-subtle)",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
          }}
        >
          ✓ {statusMessage}
        </div>
      )}
      {error && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-danger)",
            background: "var(--color-bg-subtle)",
            fontSize: "0.8rem",
            color: "var(--color-danger)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>{error}</span>
          <button
            onClick={onDismissError}
            style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", lineHeight: 1, fontSize: "1rem" }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

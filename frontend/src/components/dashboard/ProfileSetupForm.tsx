"use client";

import React, { useState } from "react";
import { api } from "../../services/api";
import styles from "../../app/dashboard/page.module.css";

interface ProfileSetupFormProps {
  onCreated: () => void;
  setError: (msg: string | null) => void;
  showStatus: (msg: string) => void;
}

export function ProfileSetupForm({ onCreated, setError, showStatus }: ProfileSetupFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", fullName: "", title: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.fullName || !form.title) {
      setError("Username, full name, and title are required.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await api.createProfile({
        username: form.username.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
        fullName: form.fullName,
        title: form.title,
      });
      showStatus("Profile initialized successfully!");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "520px", margin: "0 auto" }}>
      <h3 className={styles.cardTitle}>Initialize Career Graph</h3>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "24px", lineHeight: "1.5" }}>
        It looks like you don&apos;t have a career profile set up yet. Enter a unique username and your details below to get started!
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className={styles.label}>Choose a Unique Username</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontWeight: "600", fontSize: "0.95rem" }}>
              @
            </span>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "32px" }}
              placeholder="e.g. johndoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
              required
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. John Doe"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className={styles.label}>Professional Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Full Stack Engineer"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: "12px", padding: "12px" }} disabled={loading}>
          {loading ? "Initializing..." : "Initialize Profile"}
        </button>
      </div>
    </form>
  );
}

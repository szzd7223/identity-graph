"use client";

import React, { useState, useEffect } from "react";
import { api, Profile } from "../../services/api";

interface OverviewTabProps {
  profile: Profile;
  username: string;
  onSaved: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
  onNext?: () => void;
}

export function OverviewTab({ profile, username, onSaved, showStatus, setError, onNext }: OverviewTabProps) {
  const [form, setForm] = useState({
    fullName: profile.fullName,
    title: profile.title,
    bio: profile.bio || "",
    email: profile.email || "",
    phone: profile.phone || "",
    website: profile.website || "",
    github: profile.github || "",
    linkedin: profile.linkedin || "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      fullName: profile.fullName,
      title: profile.title,
      bio: profile.bio || "",
      email: profile.email || "",
      phone: profile.phone || "",
      website: profile.website || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.updateProfile(username, form);
      showStatus("Overview details updated successfully!");
      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to update profile details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "28px" }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "16px", color: "#181616" }}>Personal Information</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Full Name</label>
          <input type="text" className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Professional Title</label>
          <input type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Short Biography</label>
          <textarea rows={3} className="form-textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Email Address</label>
          <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Phone Number</label>
          <input type="text" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Personal Website URL</label>
          <input type="url" className="form-input" placeholder="https://..." value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>GitHub Profile URL</label>
          <input type="url" className="form-input" placeholder="https://github.com/..." value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>LinkedIn Profile URL</label>
          <input type="url" className="form-input" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Overview Entry"}
        </button>
        {onNext && (
          <button type="button" className="btn-secondary" onClick={onNext}>
            Next Step →
          </button>
        )}
      </div>
    </form>
  );
}

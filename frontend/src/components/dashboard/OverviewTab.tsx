"use client";

import React, { useState, useEffect } from "react";
import { api, Profile } from "../../services/api";

interface OverviewTabProps {
  profile: Profile;
  username: string;
  onSaved: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
}

export function OverviewTab({ profile, username, onSaved, showStatus, setError }: OverviewTabProps) {
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

  // Check if form has unsaved edits
  const isDirty =
    form.fullName !== profile.fullName ||
    form.title !== profile.title ||
    (form.bio || "") !== (profile.bio || "") ||
    (form.email || "") !== (profile.email || "") ||
    (form.phone || "") !== (profile.phone || "") ||
    (form.website || "") !== (profile.website || "") ||
    (form.github || "") !== (profile.github || "") ||
    (form.linkedin || "") !== (profile.linkedin || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty || saving) return;
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
    <form onSubmit={handleSave} style={{ borderBottom: "1.5px solid #e7e4dc", paddingBottom: "32px" }}>
      
      {/* Section Header with Save Changes Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#181616" }}>Personal Information</h3>
          <span style={{ fontSize: "0.82rem", color: "#78716c" }}>
            {isDirty ? "Unsaved changes pending" : "All changes saved"}
          </span>
        </div>

        {/* Save Changes Button (Greyed out when clean, Active + White Dot when dirty) */}
        <button
          type="submit"
          disabled={!isDirty || saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "100px",
            border: isDirty ? "1.5px solid #181616" : "1.5px solid #e7e4dc",
            background: isDirty ? "#181616" : "#f4f1ea",
            color: isDirty ? "#ffffff" : "#a8a29e",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: isDirty ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            boxShadow: isDirty ? "0 2px 10px rgba(0,0,0,0.12)" : "none"
          }}
        >
          {isDirty && (
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#ffffff",
                display: "inline-block",
                boxShadow: "0 0 6px rgba(255,255,255,0.9)"
              }}
            />
          )}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Full Name</label>
          <input
            type="text"
            className="form-input"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Professional Title</label>
          <input
            type="text"
            className="form-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Short Biography</label>
          <textarea
            rows={3}
            className="form-textarea"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Email Address</label>
          <input
            type="email"
            className="form-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Phone Number</label>
          <input
            type="text"
            className="form-input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Personal Website URL</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://..."
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>GitHub Profile URL</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://github.com/..."
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>LinkedIn Profile URL</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://linkedin.com/in/..."
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
        </div>
      </div>
    </form>
  );
}

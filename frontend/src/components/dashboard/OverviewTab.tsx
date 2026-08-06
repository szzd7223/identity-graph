"use client";

import React, { useState, useEffect } from "react";
import { api, Profile } from "../../services/api";
import styles from "../../app/dashboard/page.module.css";

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
    theme: profile.theme || "minimalist",
  });

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
      theme: profile.theme || "minimalist",
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(username, form);
      showStatus("General details updated successfully!");
      onSaved();
    } catch (err: any) {
      setError(err.message || "Failed to update details");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className={styles.cardTitle}>Personal Information</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name</label>
          <input type="text" className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Professional Title</label>
          <input type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className={`${styles.formGroup} ${styles.formFull}`}>
          <label className={styles.label}>Bio / Summary Statement</label>
          <textarea rows={4} className="form-textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Email</label>
          <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number</label>
          <input type="text" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Personal Website URL</label>
          <input type="url" className="form-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>GitHub Profile URL</label>
          <input type="url" className="form-input" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>LinkedIn Profile URL</label>
          <input type="url" className="form-input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        </div>
      </div>

      <h3 className={styles.cardTitle} style={{ marginTop: "40px" }}>Portfolio Theme Design</h3>
      <div className={styles.themeGrid}>
        {[
          { id: "minimalist", name: "Plain Minimalist", desc: "A clean, lightweight black-on-white layout focusing purely on typography, content readability, and spacious margins." },
          { id: "material-tiles", name: "Material UI Tiles", desc: "A modular dark-mode dashboard card layout featuring elevated surfaces, structural grid patterns, and modern spacing." },
          { id: "nothing-phone", name: "Nothing Phone Inspired", desc: "Retro-futuristic dot matrix grid backdrop with typewriter monospace lettering, dashed borders, and red indicator lights." },
        ].map((theme) => (
          <div
            key={theme.id}
            onClick={() => setForm({ ...form, theme: theme.id })}
            className={`${styles.themeCard} ${form.theme === theme.id ? styles.activeThemeCard : ""}`}
          >
            <div className={styles.themeName}>{theme.name}</div>
            <div className={styles.themeDesc}>{theme.desc}</div>
          </div>
        ))}
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: "40px", width: "200px" }}>
        Save All Changes
      </button>
    </form>
  );
}

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
    theme: "teak",
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
      theme: "teak",
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(username, form);
      showStatus("General details updated successfully!");
      onSaved();
      if (onNext) onNext();
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
          <label className={styles.label}>Short Biography</label>
          <textarea className="form-input" style={{ minHeight: "80px" }} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address</label>
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

      <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
        <button type="submit" className="btn-primary" style={{ width: "260px" }}>
          Save & Continue to Experience →
        </button>
        {onNext && (
          <button type="button" className="btn-secondary" onClick={onNext}>
            Skip Step
          </button>
        )}
      </div>
    </form>
  );
}

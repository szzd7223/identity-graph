"use client";

import React, { useState } from "react";
import { api, Experience } from "../../services/api";
import styles from "../../app/dashboard/page.module.css";

interface ExperiencesTabProps {
  experiences: Experience[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
  onNext?: () => void;
}

const EMPTY_FORM: Partial<Experience> = { company: "", role: "", startDate: "", endDate: "", description: "" };

export function ExperiencesTab({ experiences, username, onMutated, showStatus, setError, onNext }: ExperiencesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Experience>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (exp: Experience) => { setForm({ company: exp.company, role: exp.role, startDate: exp.startDate, endDate: exp.endDate || "", description: exp.description || "" }); setEditingId(exp.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateExperience(editingId, form);
        showStatus("Experience entry updated!");
      } else {
        await api.addExperience(username, form);
        showStatus("Experience entry added!");
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      onMutated();
    } catch (err: any) {
      setError(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await api.deleteExperience(id);
      showStatus("Experience entry removed!");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div>
      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button onClick={openAdd} className="btn-primary" style={{ alignSelf: "flex-end" }}>+ Add Experience</button>
          <div className={styles.listContainer}>
            {experiences.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No experience entries added yet.</p>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <h4>{exp.role}</h4>
                    <div className={styles.itemMeta}><strong>{exp.company}</strong> &bull; {exp.startDate} to {exp.endDate || "Present"}</div>
                    <p className={styles.itemDesc}>{exp.description}</p>
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => openEdit(exp)} className={styles.btnIcon} title="Edit">✏️</button>
                    <button onClick={() => handleDelete(exp.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {onNext && (
            <div style={{ display: "flex", marginTop: "32px", borderTop: "1px solid var(--color-border)", paddingTop: "24px" }}>
              <button type="button" className="btn-primary" onClick={onNext} style={{ width: "260px" }}>
                Continue to Education →
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <h3 className={styles.cardTitle}>{editingId ? "Edit Experience" : "Add Experience"}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input type="text" className="form-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Role / Title</label>
              <input type="text" className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Date</label>
              <input type="text" className="form-input" placeholder="e.g. June 2023" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>End Date</label>
              <input type="text" className="form-input" placeholder="e.g. Present, December 2024" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className={`${styles.formGroup} ${styles.formFull}`}>
              <label className={styles.label}>Description of Achievements</label>
              <textarea rows={4} className="form-textarea" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className={styles.subFormActions}>
            <button type="button" onClick={cancel} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Entry</button>
          </div>
        </form>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { api, Education } from "../../services/api";
import styles from "../../app/dashboard/page.module.css";

interface EducationTabProps {
  education: Education[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
  onNext?: () => void;
}

const EMPTY_FORM: Partial<Education> = { institution: "", degree: "", field: "", startDate: "", endDate: "" };

export function EducationTab({ education, username, onMutated, showStatus, setError, onNext }: EducationTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Education>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (edu: Education) => { setForm({ institution: edu.institution, degree: edu.degree, field: edu.field || "", startDate: edu.startDate, endDate: edu.endDate || "" }); setEditingId(edu.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateEducation(editingId, form);
        showStatus("Education entry updated!");
      } else {
        await api.addEducation(username, form);
        showStatus("Education entry added!");
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
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await api.deleteEducation(id);
      showStatus("Education entry removed!");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div>
      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button onClick={openAdd} className="btn-primary" style={{ alignSelf: "flex-end" }}>+ Add Education</button>
          <div className={styles.listContainer}>
            {education.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No education entries added yet.</p>
            ) : (
              education.map((edu) => (
                <div key={edu.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <h4>{edu.degree}</h4>
                    <div className={styles.itemMeta}>
                      <strong>{edu.institution}</strong> {edu.field && `• ${edu.field}`} &bull; {edu.startDate} to {edu.endDate || "Present"}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => openEdit(edu)} className={styles.btnIcon} title="Edit">✏️</button>
                    <button onClick={() => handleDelete(edu.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {onNext && (
            <div style={{ display: "flex", marginTop: "32px", borderTop: "1px solid var(--color-border)", paddingTop: "24px" }}>
              <button type="button" className="btn-primary" onClick={onNext} style={{ width: "260px" }}>
                Continue to Projects →
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <h3 className={styles.cardTitle}>{editingId ? "Edit Education" : "Add Education"}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Institution / School</label>
              <input type="text" className="form-input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Degree / Qualification</label>
              <input type="text" className="form-input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Field of Study (Optional)</label>
              <input type="text" className="form-input" placeholder="e.g. Computer Science" value={form.field || ""} onChange={(e) => setForm({ ...form, field: e.target.value })} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Start Date</label>
              <input type="text" className="form-input" placeholder="e.g. Sept 2019" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>End Date</label>
              <input type="text" className="form-input" placeholder="e.g. May 2023" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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

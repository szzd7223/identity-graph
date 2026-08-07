"use client";

import React, { useState } from "react";
import { api, Project } from "../../services/api";
import styles from "../../app/dashboard/page.module.css";

interface ProjectsTabProps {
  projects: Project[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
  onNext?: () => void;
}

const EMPTY_FORM: Partial<Project> = { title: "", description: "", url: "", technologies: "" };

export function ProjectsTab({ projects, username, onMutated, showStatus, setError, onNext }: ProjectsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (proj: Project) => { setForm({ title: proj.title, description: proj.description, url: proj.url || "", technologies: proj.technologies }); setEditingId(proj.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateProject(editingId, form);
        showStatus("Project updated!");
      } else {
        await api.addProject(username, form);
        showStatus("Project added!");
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
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.deleteProject(id);
      showStatus("Project removed!");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div>
      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button onClick={openAdd} className="btn-primary" style={{ alignSelf: "flex-end" }}>+ Add Project</button>
          <div className={styles.listContainer}>
            {projects.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No project entries added yet.</p>
            ) : (
              projects.map((proj) => (
                <div key={proj.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <h4>{proj.title}</h4>
                    <p className={styles.itemDesc}>{proj.description}</p>
                    {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textDecoration: "underline" }}>{proj.url}</a>}
                    <div style={{ marginTop: "10px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {proj.technologies.split(",").map((t) => (
                        <span key={t} style={{ background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", fontSize: "0.7rem", padding: "2px 8px", borderRadius: "10px" }}>{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => openEdit(proj)} className={styles.btnIcon} title="Edit">✏️</button>
                    <button onClick={() => handleDelete(proj.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {onNext && (
            <div style={{ display: "flex", marginTop: "32px", borderTop: "1px solid var(--color-border)", paddingTop: "24px" }}>
              <button type="button" className="btn-primary" onClick={onNext} style={{ width: "260px" }}>
                Continue to Skills →
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <h3 className={styles.cardTitle}>{editingId ? "Edit Project" : "Add Project"}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Project Title</label>
              <input type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Project URL (Optional)</label>
              <input type="url" className="form-input" placeholder="e.g. https://github.com/..." value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            <div className={`${styles.formGroup} ${styles.formFull}`}>
              <label className={styles.label}>Description of Work</label>
              <textarea rows={3} className="form-textarea" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className={`${styles.formGroup} ${styles.formFull}`}>
              <label className={styles.label}>Technologies Used (Comma-separated)</label>
              <input type="text" className="form-input" placeholder="e.g. React, Node.js, Prisma, PostgreSQL" value={form.technologies || ""} onChange={(e) => setForm({ ...form, technologies: e.target.value })} required />
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

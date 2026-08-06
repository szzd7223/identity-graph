"use client";

import React, { useState } from "react";
import { api, Skill } from "../../services/api";
import styles from "../../app/dashboard/page.module.css";

interface SkillsTabProps {
  skills: Skill[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
}

const EMPTY_FORM: Partial<Skill> = { name: "", category: "" };

export function SkillsTab({ skills, username, onMutated, showStatus, setError }: SkillsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Skill>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (skill: Skill) => { setForm({ name: skill.name, category: skill.category || "" }); setEditingId(skill.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateSkill(editingId, form);
        showStatus("Skill updated!");
      } else {
        await api.addSkill(username, form);
        showStatus("Skill added!");
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
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.deleteSkill(id);
      showStatus("Skill removed!");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div>
      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button onClick={openAdd} className="btn-primary" style={{ alignSelf: "flex-end" }}>+ Add Skill</button>
          <div className={styles.listContainer}>
            {skills.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No skill entries added yet.</p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <h4>{skill.name}</h4>
                    {skill.category && <p className={styles.itemDesc}>Category: {skill.category}</p>}
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => openEdit(skill)} className={styles.btnIcon} title="Edit">✏️</button>
                    <button onClick={() => handleDelete(skill.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card">
          <h3 className={styles.cardTitle}>{editingId ? "Edit Skill" : "Add Skill"}</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Skill Name</label>
              <input type="text" className="form-input" placeholder="e.g. TypeScript" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category (Optional)</label>
              <input type="text" className="form-input" placeholder="e.g. Frontend, Databases" value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
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

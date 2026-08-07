"use client";

import React, { useState } from "react";
import { api, Skill } from "../../services/api";

interface SkillsTabProps {
  skills: Skill[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
}

const EMPTY_FORM: Partial<Skill> = { name: "" };

export function SkillsTab({ skills, username, onMutated, showStatus, setError }: SkillsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Skill>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (skill: Skill) => { setForm({ name: skill.name }); setEditingId(skill.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.updateSkill(editingId, form);
        showStatus("Skill updated!");
      } else {
        await api.addSkill(username, form);
        showStatus("Skill added!");
      }
      setShowForm(false);
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to save skill");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setError(null);
    try {
      await api.deleteSkill(id);
      showStatus("Skill deleted");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to delete skill");
    }
  };

  return (
    <div>
      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button onClick={openAdd} className="btn-primary" style={{ alignSelf: "flex-end" }}>+ Add Skill</button>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {skills.length === 0 ? (
              <p style={{ color: "#78716c" }}>No skill entries added yet.</p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} style={{ background: "#ffffff", border: "1.5px solid #181616", padding: "8px 14px", borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#181616" }}>{skill.name}</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => openEdit(skill)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem" }} title="Edit">✏️</button>
                    <button onClick={() => handleDelete(skill.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem" }} title="Delete">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: "16px",
            marginTop: "32px", 
            borderTop: "1px solid #e7e4dc", 
            paddingTop: "24px" 
          }}>
            <div style={{
              background: "#fbf9f4",
              border: "1px solid #e7e4dc",
              borderRadius: "14px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px"
            }}>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "4px", color: "#181616" }}>Ready to share?</h4>
                <p style={{ fontSize: "0.82rem", color: "#78716c" }}>All your career data has been synchronized. Click below to view your public profile.</p>
              </div>
              <a 
                href={`/portfolio/${username}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-yellow-pill" 
                style={{ textDecoration: "none", whiteSpace: "nowrap", padding: "10px 20px" }}
              >
                View Live Portfolio ↗
              </a>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "20px", padding: "28px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "16px" }}>{editingId ? "Edit Skill" : "Add Skill"}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Skill Name</label>
              <input type="text" className="form-input" placeholder="e.g. TypeScript" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}>
            <button type="button" onClick={cancel} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Entry</button>
          </div>
        </form>
      )}
    </div>
  );
}

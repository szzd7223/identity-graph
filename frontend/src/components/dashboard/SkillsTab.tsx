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

export function SkillsTab({ skills, username, onMutated, showStatus, setError }: SkillsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "" });

  const openAdd = () => { setForm({ name: "", category: "" }); setEditingId(null); setShowForm(true); };
  const openEdit = (skill: Skill) => { setForm({ name: skill.name, category: skill.category || "" }); setEditingId(skill.id); setShowForm(true); };
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
    if (!confirm("Are you sure you want to delete this skill entry?")) return;
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
      
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#181616" }}>Technical Skills</h3>
          <span style={{ fontSize: "0.82rem", color: "#78716c" }}>{skills.length} skills logged</span>
        </div>

        {!showForm && (
          <button onClick={openAdd} className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
            + Add Skill
          </button>
        )}
      </div>

      {!showForm ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {skills.length === 0 ? (
            <p style={{ color: "#78716c", fontSize: "0.9rem" }}>No skill entries added yet.</p>
          ) : (
            skills.map((skill) => (
              <div key={skill.id} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", padding: "8px 16px", borderRadius: "100px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#181616" }}>{skill.name}</span>
                {skill.category && <span style={{ fontSize: "0.72rem", color: "#78716c", opacity: 0.8 }}>({skill.category})</span>}
                <div style={{ display: "flex", gap: "6px", marginLeft: "4px" }}>
                  <button onClick={() => openEdit(skill)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#57534e", fontWeight: 600 }} title="Edit">Edit</button>
                  <button onClick={() => handleDelete(skill.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#991b1b", fontWeight: 600 }} title="Delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", borderRadius: "16px", padding: "20px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "16px", color: "#181616" }}>{editingId ? "Edit Skill Entry" : "New Skill Entry"}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Skill Name</label>
              <input type="text" className="form-input" placeholder="e.g. TypeScript" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Category (optional)</label>
              <input type="text" className="form-input" placeholder="e.g. Frontend, Database" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
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

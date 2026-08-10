"use client";

import React, { useState } from "react";
import { api, Experience } from "../../services/api";

interface ExperiencesTabProps {
  experiences: Experience[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
}

const EMPTY_FORM: Partial<Experience> = { company: "", role: "", startDate: "", endDate: "", description: "" };

export function ExperiencesTab({ experiences, username, onMutated, showStatus, setError }: ExperiencesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Experience>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (exp: Experience) => { setForm({ company: exp.company, role: exp.role, startDate: exp.startDate, endDate: exp.endDate || "", description: exp.description || "" }); setEditingId(exp.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.updateExperience(editingId, form);
        showStatus("Experience updated!");
      } else {
        await api.addExperience(username, form);
        showStatus("Experience added!");
      }
      setShowForm(false);
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to save experience");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    setError(null);
    try {
      await api.deleteExperience(id);
      showStatus("Experience deleted");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to delete experience");
    }
  };

  return (
    <div style={{ borderBottom: "1.5px solid #e7e4dc", paddingBottom: "32px" }}>
      
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#181616" }}>Professional Experience</h3>
          <span style={{ fontSize: "0.82rem", color: "#78716c" }}>{experiences.length} roles logged</span>
        </div>

        {!showForm && (
          <button onClick={openAdd} className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
            + Add Experience
          </button>
        )}
      </div>

      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {experiences.length === 0 ? (
            <p style={{ color: "#78716c", fontSize: "0.9rem" }}>No experience entries added yet.</p>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", padding: "18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#181616" }}>{exp.role}</h4>
                  <div style={{ fontSize: "0.85rem", color: "#57534e", marginTop: "2px" }}><strong>{exp.company}</strong> &bull; {exp.startDate} to {exp.endDate || "Present"}</div>
                  <p style={{ fontSize: "0.9rem", color: "#68686e", marginTop: "6px", lineHeight: 1.5 }}>{exp.description}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(exp)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", fontWeight: 600 }} title="Edit">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", color: "#991b1b", fontWeight: 600 }} title="Delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", borderRadius: "16px", padding: "20px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "16px", color: "#181616" }}>{editingId ? "Edit Experience Entry" : "New Experience Entry"}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Company Name</label>
              <input type="text" className="form-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Role / Title</label>
              <input type="text" className="form-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Start Date</label>
              <input type="text" className="form-input" placeholder="e.g. Jan 2022" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>End Date</label>
              <input type="text" className="form-input" placeholder="e.g. Present" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Description / Accomplishments</label>
              <textarea rows={3} className="form-textarea" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

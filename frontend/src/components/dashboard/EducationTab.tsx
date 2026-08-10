"use client";

import React, { useState } from "react";
import { api, Education } from "../../services/api";

interface EducationTabProps {
  education: Education[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
}

const EMPTY_FORM: Partial<Education> = { institution: "", degree: "", field: "", startDate: "", endDate: "" };

export function EducationTab({ education, username, onMutated, showStatus, setError }: EducationTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Education>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (edu: Education) => { setForm({ institution: edu.institution, degree: edu.degree, field: edu.field || "", startDate: edu.startDate, endDate: edu.endDate || "" }); setEditingId(edu.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.updateEducation(editingId, form);
        showStatus("Education entry updated!");
      } else {
        await api.addEducation(username, form);
        showStatus("Education entry added!");
      }
      setShowForm(false);
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to save education entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    setError(null);
    try {
      await api.deleteEducation(id);
      showStatus("Education deleted");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to delete education entry");
    }
  };

  return (
    <div style={{ borderBottom: "1.5px solid #e7e4dc", paddingBottom: "32px" }}>
      
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#181616" }}>Education History</h3>
          <span style={{ fontSize: "0.82rem", color: "#78716c" }}>{education.length} degrees logged</span>
        </div>

        {!showForm && (
          <button onClick={openAdd} className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
            + Add Education
          </button>
        )}
      </div>

      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {education.length === 0 ? (
            <p style={{ color: "#78716c", fontSize: "0.9rem" }}>No education entries added yet.</p>
          ) : (
            education.map((edu) => (
              <div key={edu.id} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", padding: "18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#181616" }}>{edu.institution}</h4>
                  <div style={{ fontSize: "0.85rem", color: "#57534e", marginTop: "2px" }}><strong>{edu.degree}</strong> {edu.field && `in ${edu.field}`} &bull; {edu.startDate} to {edu.endDate || "Present"}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(edu)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", fontWeight: 600 }} title="Edit">Edit</button>
                  <button onClick={() => handleDelete(edu.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", color: "#991b1b", fontWeight: 600 }} title="Delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", borderRadius: "16px", padding: "20px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "16px", color: "#181616" }}>{editingId ? "Edit Education Entry" : "New Education Entry"}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Institution / School</label>
              <input type="text" className="form-input" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Degree / Qualification</label>
              <input type="text" className="form-input" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Field of Study</label>
              <input type="text" className="form-input" placeholder="e.g. Computer Science" value={form.field || ""} onChange={(e) => setForm({ ...form, field: e.target.value })} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Start Date</label>
              <input type="text" className="form-input" placeholder="e.g. 2018" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>End Date</label>
              <input type="text" className="form-input" placeholder="e.g. 2022" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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

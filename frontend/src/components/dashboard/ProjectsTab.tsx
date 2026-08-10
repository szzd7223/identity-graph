"use client";

import React, { useState } from "react";
import { api, Project } from "../../services/api";

interface ProjectsTabProps {
  projects: Project[];
  username: string;
  onMutated: () => void;
  showStatus: (msg: string) => void;
  setError: (msg: string | null) => void;
}

const EMPTY_FORM: Partial<Project> = { title: "", description: "", url: "", technologies: "" };

export function ProjectsTab({ projects, username, onMutated, showStatus, setError }: ProjectsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (proj: Project) => { setForm({ title: proj.title, description: proj.description, url: proj.url || "", technologies: proj.technologies }); setEditingId(proj.id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.updateProject(editingId, form);
        showStatus("Project updated!");
      } else {
        await api.addProject(username, form);
        showStatus("Project added!");
      }
      setShowForm(false);
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project entry?")) return;
    setError(null);
    try {
      await api.deleteProject(id);
      showStatus("Project deleted");
      onMutated();
    } catch (err: any) {
      setError(err.message || "Failed to delete project");
    }
  };

  return (
    <div style={{ borderBottom: "1.5px solid #e7e4dc", paddingBottom: "32px" }}>
      
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#181616" }}>Projects & Pursuits</h3>
          <span style={{ fontSize: "0.82rem", color: "#78716c" }}>{projects.length} projects logged</span>
        </div>

        {!showForm && (
          <button onClick={openAdd} className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
            + Add Project
          </button>
        )}
      </div>

      {!showForm ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {projects.length === 0 ? (
            <p style={{ color: "#78716c", fontSize: "0.9rem" }}>No project entries added yet.</p>
          ) : (
            projects.map((proj) => (
              <div key={proj.id} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", padding: "18px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#181616" }}>{proj.title}</h4>
                  <p style={{ fontSize: "0.9rem", color: "#68686e", marginTop: "4px", lineHeight: 1.5 }}>{proj.description}</p>
                  {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "#78716c", textDecoration: "underline" }}>{proj.url}</a>}
                  <div style={{ marginTop: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {proj.technologies.split(",").map((t) => (
                      <span key={t} style={{ background: "#ffffff", border: "1px solid #e7e4dc", fontSize: "0.74rem", padding: "3px 10px", borderRadius: "100px", fontWeight: 600, color: "#57534e" }}>{t.trim()}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(proj)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", fontWeight: 600 }} title="Edit">Edit</button>
                  <button onClick={() => handleDelete(proj.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem", color: "#991b1b", fontWeight: 600 }} title="Delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "#fbf9f4", border: "1px solid #e7e4dc", borderRadius: "16px", padding: "20px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "16px", color: "#181616" }}>{editingId ? "Edit Project Entry" : "New Project Entry"}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Project Title</label>
              <input type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Live Project URL</label>
              <input type="url" className="form-input" placeholder="https://..." value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Technologies Used (comma separated)</label>
              <input type="text" className="form-input" placeholder="e.g. Next.js, TypeScript, PostgreSQL" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} required />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Project Description</label>
              <textarea rows={3} className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
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

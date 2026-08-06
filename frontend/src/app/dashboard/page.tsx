"use client";

import { useEffect, useState, use } from "react";
import { api, Profile, Experience, Education, Project, Skill } from "../../services/api";
import styles from "./page.module.css";
import Link from "next/link";

type Tab = "overview" | "experiences" | "education" | "projects" | "skills";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function DashboardPage({ searchParams }: PageProps) {
  // Unwrap searchParams promise using React.use()
  const resolvedSearchParams = use(searchParams);
  const usernameParam = typeof resolvedSearchParams.username === "string" ? resolvedSearchParams.username : "johndoe";

  const [username, setUsername] = useState(usernameParam);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form States
  const [overviewForm, setOverviewForm] = useState({
    fullName: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    website: "",
    github: "",
    linkedin: "",
    theme: "minimalist",
  });

  // Subform addition states
  const [showSubForm, setShowSubForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [expForm, setExpForm] = useState<Partial<Experience>>({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [eduForm, setEduForm] = useState<Partial<Education>>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
  });

  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: "",
    description: "",
    url: "",
    technologies: "",
  });

  const [skillForm, setSkillForm] = useState<Partial<Skill>>({
    name: "",
    category: "",
  });

  const fetchProfile = async (u: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProfile(u);
      setProfile(data);
      setOverviewForm({
        fullName: data.fullName,
        title: data.title,
        bio: data.bio || "",
        email: data.email || "",
        phone: data.phone || "",
        website: data.website || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        theme: data.theme || "minimalist",
      });
    } catch (err: any) {
      // If profile doesn't exist, we can offer to create one
      if (err.message.includes("not found")) {
        setProfile(null);
      } else {
        setError(err.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(username);
  }, [username]);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Profile creation
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newProfile = await api.createProfile({
        username,
        fullName: "New Developer",
        title: "Software Engineer",
      });
      setProfile(newProfile);
      fetchProfile(username);
      showStatus("Profile created successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  // Overview Save
  const handleOverviewSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(username, overviewForm);
      showStatus("General details updated successfully!");
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Failed to update details");
    }
  };

  // ====================================================
  // SUB-ITEM HANDLING (CRUD)
  // ====================================================

  // Experience
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await api.updateExperience(editingItemId, expForm);
        showStatus("Experience entry updated!");
      } else {
        await api.addExperience(username, expForm);
        showStatus("Experience entry added!");
      }
      setExpForm({ company: "", role: "", startDate: "", endDate: "", description: "" });
      setShowSubForm(false);
      setEditingItemId(null);
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Operation failed");
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setExpForm({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      description: exp.description || "",
    });
    setEditingItemId(exp.id);
    setShowSubForm(true);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await api.deleteExperience(id);
      showStatus("Experience deleted");
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Deletion failed");
    }
  };

  // Education
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await api.updateEducation(editingItemId, eduForm);
        showStatus("Education entry updated!");
      } else {
        await api.addEducation(username, eduForm);
        showStatus("Education entry added!");
      }
      setEduForm({ institution: "", degree: "", field: "", startDate: "", endDate: "" });
      setShowSubForm(false);
      setEditingItemId(null);
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Operation failed");
    }
  };

  const handleEditEducation = (edu: Education) => {
    setEduForm({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field || "",
      startDate: edu.startDate,
      endDate: edu.endDate || "",
    });
    setEditingItemId(edu.id);
    setShowSubForm(true);
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await api.deleteEducation(id);
      showStatus("Education deleted");
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Deletion failed");
    }
  };

  // Projects
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await api.updateProject(editingItemId, projectForm);
        showStatus("Project entry updated!");
      } else {
        await api.addProject(username, projectForm);
        showStatus("Project entry added!");
      }
      setProjectForm({ title: "", description: "", url: "", technologies: "" });
      setShowSubForm(false);
      setEditingItemId(null);
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Operation failed");
    }
  };

  const handleEditProject = (proj: Project) => {
    setProjectForm({
      title: proj.title,
      description: proj.description,
      url: proj.url || "",
      technologies: proj.technologies,
    });
    setEditingItemId(proj.id);
    setShowSubForm(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.deleteProject(id);
      showStatus("Project deleted");
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Deletion failed");
    }
  };

  // Skills
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addSkill(username, skillForm);
      showStatus("Skill added!");
      setSkillForm({ name: "", category: "" });
      setShowSubForm(false);
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Operation failed");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.deleteSkill(id);
      showStatus("Skill removed");
      fetchProfile(username);
    } catch (err: any) {
      setError(err.message || "Deletion failed");
    }
  };

  // Profile not found layout
  if (!loading && !profile) {
    return (
      <div className={styles.container} style={{ justifyContent: "center", alignItems: "center", padding: "40px" }}>
        <div className="glass-panel glow-accent" style={{ padding: "40px", maxWidth: "500px", width: "100%", textRendering: "optimizeLegibility" }}>
          <h2 style={{ marginBottom: "15px" }}>No Profile Found</h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "30px", fontSize: "0.95rem", lineHeight: "1.5" }}>
            The profile with username <strong>&apos;{username}&apos;</strong> does not exist in the database yet. Press Create to set up a new portfolio.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleCreateProfile} className="btn-primary" style={{ flex: 1 }}>
              Create Profile &apos;{username}&apos;
            </button>
            <Link href="/" className="btn-secondary" style={{ flex: 1, textAlign: "center" }}>
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* SIDEBAR TABS */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoText}>IdentityGraph</div>
        </div>

        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {profile?.fullName.charAt(0) || "U"}
          </div>
          <div className={styles.userInfo}>
            <h4>{profile?.fullName}</h4>
            <p>@{profile?.username}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            onClick={() => { setActiveTab("overview"); setShowSubForm(false); }}
            className={`${styles.navItem} ${activeTab === "overview" ? styles.activeNavItem : ""}`}
          >
            Overview & Theme
          </button>
          <button
            onClick={() => { setActiveTab("experiences"); setShowSubForm(false); }}
            className={`${styles.navItem} ${activeTab === "experiences" ? styles.activeNavItem : ""}`}
          >
            Experience
          </button>
          <button
            onClick={() => { setActiveTab("education"); setShowSubForm(false); }}
            className={`${styles.navItem} ${activeTab === "education" ? styles.activeNavItem : ""}`}
          >
            Education
          </button>
          <button
            onClick={() => { setActiveTab("projects"); setShowSubForm(false); }}
            className={`${styles.navItem} ${activeTab === "projects" ? styles.activeNavItem : ""}`}
          >
            Projects
          </button>
          <button
            onClick={() => { setActiveTab("skills"); setShowSubForm(false); }}
            className={`${styles.navItem} ${activeTab === "skills" ? styles.activeNavItem : ""}`}
          >
            Skills
          </button>
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href={`/portfolio/${username}`}
            target="_blank"
            className="btn-primary"
            style={{ fontSize: "0.85rem", padding: "10px 16px", textDecoration: "none", textAlign: "center" }}
          >
            View Live Portfolio ↗
          </Link>
          <Link href="/" className="btn-secondary" style={{ fontSize: "0.85rem", padding: "10px 16px", textAlign: "center" }}>
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        {/* Status indicators */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              {activeTab === "overview" && "General Details & Theme Layout"}
              {activeTab === "experiences" && "Professional Experiences"}
              {activeTab === "education" && "Education History"}
              {activeTab === "projects" && "Projects & Side Pursuits"}
              {activeTab === "skills" && "Skills & Competencies"}
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>
              Manage the data that will feed directly into your public portfolio layouts and AI MCP client.
            </p>
          </div>
          {statusMessage && (
            <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgb(34, 197, 94)", color: "rgb(74, 222, 128)", padding: "10px 20px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
              {statusMessage}
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgb(239, 68, 68)", color: "rgb(248, 113, 113)", padding: "15px 20px", borderRadius: "8px", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Error: {error}</span>
            <button onClick={() => setError(null)} style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontWeight: "700" }}>X</button>
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
            <div style={{ width: "40px", height: "40px", border: "4px solid rgba(255, 255, 255, 0.1)", borderTopColor: "var(--border-focus)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div>
            {/* 1. OVERVIEW FORM */}
            {activeTab === "overview" && (
              <form onSubmit={handleOverviewSave} className="glass-panel" style={{ padding: "30px" }}>
                <h3 className={styles.cardTitle}>Personal Information</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={overviewForm.fullName}
                      onChange={(e) => setOverviewForm({ ...overviewForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Professional Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={overviewForm.title}
                      onChange={(e) => setOverviewForm({ ...overviewForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.formFull}`}>
                    <label className={styles.label}>Bio / Summary Statement</label>
                    <textarea
                      rows={4}
                      className="form-textarea"
                      value={overviewForm.bio}
                      onChange={(e) => setOverviewForm({ ...overviewForm, bio: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Contact Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={overviewForm.email}
                      onChange={(e) => setOverviewForm({ ...overviewForm, email: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={overviewForm.phone}
                      onChange={(e) => setOverviewForm({ ...overviewForm, phone: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Personal Website URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={overviewForm.website}
                      onChange={(e) => setOverviewForm({ ...overviewForm, website: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>GitHub Profile URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={overviewForm.github}
                      onChange={(e) => setOverviewForm({ ...overviewForm, github: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={overviewForm.linkedin}
                      onChange={(e) => setOverviewForm({ ...overviewForm, linkedin: e.target.value })}
                    />
                  </div>
                </div>

                <h3 className={styles.cardTitle} style={{ marginTop: "40px" }}>Portfolio Theme Design</h3>
                <div className={styles.themeGrid}>
                  <div
                    onClick={() => setOverviewForm({ ...overviewForm, theme: "minimalist" })}
                    className={`${styles.themeCard} ${overviewForm.theme === "minimalist" ? styles.activeThemeCard : ""}`}
                  >
                    <div className={styles.themeName}>Plain Minimalist</div>
                    <div className={styles.themeDesc}>A clean, lightweight black-on-white layout focusing purely on typography, content readability, and spacious margins.</div>
                  </div>
                  <div
                    onClick={() => setOverviewForm({ ...overviewForm, theme: "material-tiles" })}
                    className={`${styles.themeCard} ${overviewForm.theme === "material-tiles" ? styles.activeThemeCard : ""}`}
                  >
                    <div className={styles.themeName}>Material UI Tiles</div>
                    <div className={styles.themeDesc}>A modular dark-mode dashboard card layout featuring elevated surfaces, structural grid patterns, and modern spacing.</div>
                  </div>
                  <div
                    onClick={() => setOverviewForm({ ...overviewForm, theme: "nothing-phone" })}
                    className={`${styles.themeCard} ${overviewForm.theme === "nothing-phone" ? styles.activeThemeCard : ""}`}
                  >
                    <div className={styles.themeName}>Nothing Phone Inspired</div>
                    <div className={styles.themeDesc}>Retro-futuristic dot matrix grid backdrop with typewriter monospace lettering, dashed borders, and red indicator lights.</div>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "40px", width: "200px" }}>
                  Save All Changes
                </button>
              </form>
            )}

            {/* 2. EXPERIENCES TAB */}
            {activeTab === "experiences" && (
              <div>
                {!showSubForm ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <button onClick={() => { setShowSubForm(true); setEditingItemId(null); }} className="btn-primary" style={{ alignSelf: "flex-end" }}>
                      + Add New Experience
                    </button>
                    
                    <div className={styles.listContainer}>
                      {profile?.experiences.length === 0 ? (
                        <p style={{ color: "var(--muted-foreground)" }}>No experiences added yet.</p>
                      ) : (
                        profile?.experiences.map((exp) => (
                          <div key={exp.id} className={styles.listItem}>
                            <div className={styles.itemContent}>
                              <h4>{exp.role}</h4>
                              <div className={styles.itemMeta}>
                                <strong>{exp.company}</strong> &bull; {exp.startDate} to {exp.endDate || "Present"}
                              </div>
                              <p className={styles.itemDesc}>{exp.description}</p>
                            </div>
                            <div className={styles.itemActions}>
                              <button onClick={() => handleEditExperience(exp)} className={styles.btnIcon} title="Edit">✏️</button>
                              <button onClick={() => handleDeleteExperience(exp.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddExperience} className="glass-panel" style={{ padding: "30px" }}>
                    <h3 className={styles.cardTitle}>{editingItemId ? "Edit Experience" : "Add Experience"}</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Company Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={expForm.company}
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Role / Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={expForm.role}
                          onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Start Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. June 2023"
                          value={expForm.startDate}
                          onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>End Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Present, December 2024"
                          value={expForm.endDate || ""}
                          onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label className={styles.label}>Description of Achievements</label>
                        <textarea
                          rows={4}
                          className="form-textarea"
                          value={expForm.description || ""}
                          onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={styles.subFormActions}>
                      <button type="button" onClick={() => setShowSubForm(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Save Entry</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 3. EDUCATION TAB */}
            {activeTab === "education" && (
              <div>
                {!showSubForm ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <button onClick={() => { setShowSubForm(true); setEditingItemId(null); }} className="btn-primary" style={{ alignSelf: "flex-end" }}>
                      + Add Education
                    </button>
                    
                    <div className={styles.listContainer}>
                      {profile?.education.length === 0 ? (
                        <p style={{ color: "var(--muted-foreground)" }}>No education entries added yet.</p>
                      ) : (
                        profile?.education.map((edu) => (
                          <div key={edu.id} className={styles.listItem}>
                            <div className={styles.itemContent}>
                              <h4>{edu.degree}</h4>
                              <div className={styles.itemMeta}>
                                <strong>{edu.institution}</strong> &bull; {edu.field}
                              </div>
                              <p className={styles.itemDesc}>{edu.startDate} to {edu.endDate || "Present"}</p>
                            </div>
                            <div className={styles.itemActions}>
                              <button onClick={() => handleEditEducation(edu)} className={styles.btnIcon} title="Edit">✏️</button>
                              <button onClick={() => handleDeleteEducation(edu.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddEducation} className="glass-panel" style={{ padding: "30px" }}>
                    <h3 className={styles.cardTitle}>{editingItemId ? "Edit Education" : "Add Education"}</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Institution / School</label>
                        <input
                          type="text"
                          className="form-input"
                          value={eduForm.institution}
                          onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Degree / Certificate</label>
                        <input
                          type="text"
                          className="form-input"
                          value={eduForm.degree}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Field of Study</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Computer Science"
                          value={eduForm.field || ""}
                          onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Start Year</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 2019"
                          value={eduForm.startDate}
                          onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>End Year</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 2023, Present"
                          value={eduForm.endDate || ""}
                          onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className={styles.subFormActions}>
                      <button type="button" onClick={() => setShowSubForm(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Save Entry</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 4. PROJECTS TAB */}
            {activeTab === "projects" && (
              <div>
                {!showSubForm ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <button onClick={() => { setShowSubForm(true); setEditingItemId(null); }} className="btn-primary" style={{ alignSelf: "flex-end" }}>
                      + Add Project
                    </button>
                    
                    <div className={styles.listContainer}>
                      {profile?.projects.length === 0 ? (
                        <p style={{ color: "var(--muted-foreground)" }}>No projects added yet.</p>
                      ) : (
                        profile?.projects.map((proj) => (
                          <div key={proj.id} className={styles.listItem}>
                            <div className={styles.itemContent}>
                              <h4>{proj.title}</h4>
                              <div className={styles.itemMeta}>
                                {proj.url && <a href={proj.url} target="_blank" style={{ color: "var(--border-focus)", textDecoration: "underline" }}>{proj.url}</a>}
                              </div>
                              <p className={styles.itemDesc} style={{ marginBottom: "10px" }}>{proj.description}</p>
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {proj.technologies.split(",").map((tech) => (
                                  <span key={tech} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: "0.75rem", padding: "3px 8px", borderRadius: "4px" }}>
                                    {tech.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className={styles.itemActions}>
                              <button onClick={() => handleEditProject(proj)} className={styles.btnIcon} title="Edit">✏️</button>
                              <button onClick={() => handleDeleteProject(proj.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddProject} className="glass-panel" style={{ padding: "30px" }}>
                    <h3 className={styles.cardTitle}>{editingItemId ? "Edit Project" : "Add Project"}</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Project Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Project URL</label>
                        <input
                          type="url"
                          className="form-input"
                          placeholder="e.g. https://github.com/..."
                          value={projectForm.url || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label className={styles.label}>Technologies Used (comma separated)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. React, TypeScript, Prisma, PostgreSQL"
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                          required
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label className={styles.label}>Short Summary Description</label>
                        <textarea
                          rows={4}
                          className="form-textarea"
                          value={projectForm.description || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.subFormActions}>
                      <button type="button" onClick={() => setShowSubForm(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Save Entry</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 5. SKILLS TAB */}
            {activeTab === "skills" && (
              <div>
                <form onSubmit={handleAddSkill} className="glass-panel subForm" style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
                  <div className={styles.formGroup} style={{ flex: 2 }}>
                    <label className={styles.label}>Skill Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. TypeScript"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1.5 }}>
                    <label className={styles.label}>Category (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Languages, Frontend, Tools"
                      value={skillForm.category || ""}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ flex: 0.8, height: "46px", padding: "0" }}>
                    Add Skill
                  </button>
                </form>

                <div className="glass-panel" style={{ padding: "30px", marginTop: "30px" }}>
                  <h3 className={styles.cardTitle}>Your Registered Skills</h3>
                  <div className={styles.skillsContainer}>
                    {profile?.skills.length === 0 ? (
                      <p style={{ color: "var(--muted-foreground)" }}>No skills listed yet.</p>
                    ) : (
                      profile?.skills.map((skill) => (
                        <div key={skill.id} className={styles.skillBadge}>
                          <span>{skill.name}</span>
                          {skill.category && (
                            <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>({skill.category})</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteSkill(skill.id)}
                            className={styles.btnDeleteBadge}
                            title="Remove Skill"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

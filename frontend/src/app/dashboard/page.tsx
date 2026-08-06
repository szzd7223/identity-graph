"use client";

import { useEffect, useState, use } from "react";
import { api, Profile, Experience, Education, Project, Skill } from "../../services/api";
import { supabase } from "../../services/supabase";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

type Tab = "overview" | "experiences" | "education" | "projects" | "skills";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function DashboardPage({ searchParams }: PageProps) {
  const router = useRouter();
  
  // Keep props to satisfy Next.js page routing signature
  use(searchParams);

  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Profile creation states
  const [createForm, setCreateForm] = useState({
    username: "",
    fullName: "",
    title: "",
  });

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

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyProfile();
      setProfile(data);
      setUsername(data.username);
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
      if (err.message && err.message.includes("PROFILE_NOT_FOUND")) {
        setProfile(null);
      } else {
        setError(err.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      
      // Load user profile details
      await fetchProfile();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (!currentSession) {
          router.push("/login");
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    checkAuth();
  }, [router]);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Profile creation
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.username || !createForm.fullName || !createForm.title) {
      setError("Username, full name, and title are required.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const newProfile = await api.createProfile({
        username: createForm.username.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
        fullName: createForm.fullName,
        title: createForm.title,
      });
      setProfile(newProfile);
      await fetchProfile();
      showStatus("Profile initialized successfully!");
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
      fetchProfile();
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
      fetchProfile();
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
      showStatus("Experience entry removed!");
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "Delete failed");
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
      fetchProfile();
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
      showStatus("Education entry removed!");
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  // Projects
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await api.updateProject(editingItemId, projectForm);
        showStatus("Project updated!");
      } else {
        await api.addProject(username, projectForm);
        showStatus("Project added!");
      }
      setProjectForm({ title: "", description: "", url: "", technologies: "" });
      setShowSubForm(false);
      setEditingItemId(null);
      fetchProfile();
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
      showStatus("Project removed!");
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  // Skills
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItemId) {
        await api.updateSkill(editingItemId, skillForm);
        showStatus("Skill updated!");
      } else {
        await api.addSkill(username, skillForm);
        showStatus("Skill added!");
      }
      setSkillForm({ name: "", category: "" });
      setShowSubForm(false);
      setEditingItemId(null);
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "Operation failed");
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setSkillForm({
      name: skill.name,
      category: skill.category || "",
    });
    setEditingItemId(skill.id);
    setShowSubForm(true);
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.deleteSkill(id);
      showStatus("Skill removed!");
      fetchProfile();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR NAVIGATION */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.avatarMock}>
            {profile ? profile.fullName.charAt(0).toUpperCase() : "?"}
          </div>
          <div className={styles.userInfo}>
            {profile ? (
              <>
                <h4>{profile.fullName}</h4>
                <p>@{profile.username}</p>
              </>
            ) : (
              <>
                <h4>New User</h4>
                <p>Create Profile</p>
              </>
            )}
          </div>
        </div>

        {profile && (
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
        )}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {profile && (
            <Link
              href={`/portfolio/${username}`}
              target="_blank"
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "10px 16px", textDecoration: "none", textAlign: "center" }}
            >
              View Live Portfolio ↗
            </Link>
          )}
          <button 
            onClick={handleSignOut} 
            className="btn-secondary" 
            style={{ fontSize: "0.85rem", padding: "10px 16px", textAlign: "center", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        {/* Status indicators */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              {!profile && "Profile Setup"}
              {profile && activeTab === "overview" && "General Details & Theme Layout"}
              {profile && activeTab === "experiences" && "Professional Experiences"}
              {profile && activeTab === "education" && "Education History"}
              {profile && activeTab === "projects" && "Projects & Side Pursuits"}
              {profile && activeTab === "skills" && "Skills & Competencies"}
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>
              Manage the data that will feed directly into your public portfolio layouts and AI MCP client.
            </p>
          </div>
          {statusMessage && (
            <div style={{ background: "rgba(217, 78, 78, 0.15)", border: "1px solid rgb(217, 78, 78)", color: "#e05e5e", padding: "10px 20px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
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
        ) : !profile ? (
          /* fallback profile initialization form */
          <form onSubmit={handleCreateProfile} className="glass-panel" style={{ padding: "40px", maxWidth: "550px", margin: "20px auto" }}>
            <h3 className={styles.cardTitle}>Initialize Career Graph</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", marginBottom: "24px", lineHeight: "1.5" }}>
              It looks like you don&apos;t have a career profile set up yet. Enter a unique username and your details below to get started!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label className={styles.label}>Choose a Unique Username</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)", fontWeight: "600", fontSize: "0.95rem" }}>
                    @
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: "32px" }}
                    placeholder="e.g. johndoe"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label className={styles.label}>Professional Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full Stack Engineer"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: "12px", padding: "12px" }}>
                Initialize Profile
              </button>
            </div>
          </form>
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
                    <button onClick={() => { setShowSubForm(true); setEditingItemId(null); setExpForm({ company: "", role: "", startDate: "", endDate: "", description: "" }); }} className="btn-primary" style={{ alignSelf: "flex-end" }}>
                      + Add Experience
                    </button>
                    
                    <div className={styles.listContainer}>
                      {profile?.experiences.length === 0 ? (
                        <p style={{ color: "var(--muted-foreground)" }}>No experience entries added yet.</p>
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
                    <button onClick={() => { setShowSubForm(true); setEditingItemId(null); setEduForm({ institution: "", degree: "", field: "", startDate: "", endDate: "" }); }} className="btn-primary" style={{ alignSelf: "flex-end" }}>
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
                                <strong>{edu.institution}</strong> {edu.field && `• ${edu.field}`} &bull; {edu.startDate} to {edu.endDate || "Present"}
                              </div>
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
                        <label className={styles.label}>Degree / Qualification</label>
                        <input
                          type="text"
                          className="form-input"
                          value={eduForm.degree}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Field of Study (Optional)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Computer Science"
                          value={eduForm.field || ""}
                          onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Start Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Sept 2019"
                          value={eduForm.startDate}
                          onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>End Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. May 2023"
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
                    <button onClick={() => { setShowSubForm(true); setEditingItemId(null); setProjectForm({ title: "", description: "", url: "", technologies: "" }); }} className="btn-primary" style={{ alignSelf: "flex-end" }}>
                      + Add Project
                    </button>
                    
                    <div className={styles.listContainer}>
                      {profile?.projects.length === 0 ? (
                        <p style={{ color: "var(--muted-foreground)" }}>No project entries added yet.</p>
                      ) : (
                        profile?.projects.map((proj) => (
                          <div key={proj.id} className={styles.listItem}>
                            <div className={styles.itemContent}>
                              <h4>{proj.title}</h4>
                              <p className={styles.itemDesc}>{proj.description}</p>
                              {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--coral)", textDecoration: "underline" }}>{proj.url}</a>}
                              <div style={{ marginTop: "10px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                {proj.technologies.split(",").map(t => (
                                  <span key={t} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: "0.7rem", padding: "2px 8px", borderRadius: "10px" }}>{t.trim()}</span>
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
                        <label className={styles.label}>Project URL (Optional)</label>
                        <input
                          type="url"
                          className="form-input"
                          placeholder="e.g. https://github.com/..."
                          value={projectForm.url || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label className={styles.label}>Description of Work</label>
                        <textarea
                          rows={3}
                          className="form-textarea"
                          value={projectForm.description || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.formFull}`}>
                        <label className={styles.label}>Technologies Used (Comma-separated)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. React, Node.js, Prisma, PostgreSQL"
                          value={projectForm.technologies || ""}
                          onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
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
                {!showSubForm ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <button onClick={() => { setShowSubForm(true); setEditingItemId(null); setSkillForm({ name: "", category: "" }); }} className="btn-primary" style={{ alignSelf: "flex-end" }}>
                      + Add Skill
                    </button>
                    
                    <div className={styles.listContainer}>
                      {profile?.skills.length === 0 ? (
                        <p style={{ color: "var(--muted-foreground)" }}>No skill entries added yet.</p>
                      ) : (
                        profile?.skills.map((skill) => (
                          <div key={skill.id} className={styles.listItem}>
                            <div className={styles.itemContent}>
                              <h4>{skill.name}</h4>
                              {skill.category && <p className={styles.itemDesc}>Category: {skill.category}</p>}
                            </div>
                            <div className={styles.itemActions}>
                              <button onClick={() => handleEditSkill(skill)} className={styles.btnIcon} title="Edit">✏️</button>
                              <button onClick={() => handleDeleteSkill(skill.id)} className={`${styles.btnIcon} ${styles.btnIconDelete}`} title="Delete">🗑️</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAddSkill} className="glass-panel" style={{ padding: "30px" }}>
                    <h3 className={styles.cardTitle}>{editingItemId ? "Edit Skill" : "Add Skill"}</h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
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
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Category (Optional)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Frontend, Databases"
                          value={skillForm.category || ""}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
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
          </div>
        )}
      </main>
    </div>
  );
}

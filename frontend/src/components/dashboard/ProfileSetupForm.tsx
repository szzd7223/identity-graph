"use client";

import React, { useState } from "react";
import { api } from "../../services/api";
import styles from "../../app/dashboard/page.module.css";

interface ProfileSetupFormProps {
  onCreated: () => void;
  setError: (msg: string | null) => void;
  showStatus: (msg: string) => void;
}

export function ProfileSetupForm({ onCreated, setError, showStatus }: ProfileSetupFormProps) {
  const [loading, setLoading] = useState(false);
  const [resumeParsing, setResumeParsing] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Consolidated Onboarding State
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    title: "",
    bio: "",
    email: "",
  });

  const [experience, setExperience] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [education, setEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
  });

  const [project, setProject] = useState({
    title: "",
    description: "",
    url: "",
    technologies: "",
  });

  const [skillsString, setSkillsString] = useState("");

  // ─── LLM Resume Autofill ──────────────────────────────────────────────────
  const handleResumeUpload = async (file: File) => {
    setResumeParsing(true);
    setError(null);
    try {
      const result = await api.parseResume(file);
      const data = result.data;

      if (!data) throw new Error("No data returned from resume parser.");

      const p = data.profile || {};
      const exps: any[] = data.experiences || [];
      const edus: any[] = data.education || [];
      const projs: any[] = data.projects || [];
      const skills: any[] = data.skills || [];

      // Fill profile fields
      setForm({
        username: p.fullName
          ? p.fullName.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20)
          : "",
        fullName: p.fullName || "",
        title: p.title || "",
        bio: p.bio || "",
        email: p.email || "",
      });

      // Fill first experience
      if (exps.length > 0) {
        const e = exps[0];
        setExperience({
          company: e.company || "",
          role: e.role || "",
          startDate: e.startDate || "",
          endDate: e.endDate || "",
          description: e.description || "",
        });
      }

      // Fill first education
      if (edus.length > 0) {
        const e = edus[0];
        setEducation({
          institution: e.institution || "",
          degree: e.degree || "",
          field: e.field || "",
          startDate: e.startDate || "",
          endDate: e.endDate || "",
        });
      }

      // Fill first project
      if (projs.length > 0) {
        const pr = projs[0];
        setProject({
          title: pr.title || "",
          description: pr.description || "",
          url: pr.url || "",
          technologies: pr.technologies || "",
        });
      }

      // Fill skills
      if (skills.length > 0) {
        setSkillsString(skills.map((s: any) => s.name).join(", "));
      }

      showStatus(`✅ Resume parsed by AI! ${exps.length} experiences, ${edus.length} education, ${projs.length} projects, ${skills.length} skills extracted.`);
    } catch (err: any) {
      setError(err.message || "Resume parsing failed.");
    } finally {
      setResumeParsing(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!form.username.trim() || !form.fullName.trim() || !form.title.trim())) return;
    if (step === 2 && (!experience.company.trim() || !experience.role.trim() || !experience.startDate.trim())) return;
    if (step === 3 && (!education.institution.trim() || !education.degree.trim() || !education.startDate.trim())) return;
    if (step === 4 && (!project.title.trim() || !project.technologies.trim() || !project.description.trim())) return;
    setStep((s) => (s + 1) as any);
  };

  const prevStep = () => {
    setStep((s) => (s - 1) as any);
  };

  const skipExperience = () => {
    setExperience({ company: "", role: "", startDate: "", endDate: "", description: "" });
    setStep(3);
  };

  const skipEducation = () => {
    setEducation({ institution: "", degree: "", field: "", startDate: "", endDate: "" });
    setStep(4);
  };

  const skipProject = () => {
    setProject({ title: "", description: "", url: "", technologies: "" });
    setStep(5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cleanUsername = form.username.toLowerCase().replace(/[^a-z0-9_-]/g, "");

      // 1. Create Base Profile
      await api.createProfile({
        username: cleanUsername,
        fullName: form.fullName,
        title: form.title,
        bio: form.bio,
        email: form.email || null,
        theme: "teak",
      });

      // 2. Add Experience (If not skipped)
      if (experience.company && experience.role && experience.startDate) {
        await api.addExperience(cleanUsername, {
          company: experience.company,
          role: experience.role,
          startDate: experience.startDate,
          endDate: experience.endDate || null,
          description: experience.description || null,
        });
      }

      // 3. Add Education (If not skipped)
      if (education.institution && education.degree && education.startDate) {
        await api.addEducation(cleanUsername, {
          institution: education.institution,
          degree: education.degree,
          field: education.field || null,
          startDate: education.startDate,
          endDate: education.endDate || null,
        });
      }

      // 4. Add Project (If not skipped)
      if (project.title && project.technologies && project.description) {
        await api.addProject(cleanUsername, {
          title: project.title,
          description: project.description,
          url: project.url || null,
          technologies: project.technologies,
        });
      }

      // 5. Add Skills (If filled)
      if (skillsString.trim()) {
        const skillNames = skillsString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        for (const name of skillNames) {
          await api.addSkill(cleanUsername, { name });
        }
      }

      showStatus("Welcome to IdentityGraph! Your career graph is seeded and ready.");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to initialize profile. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ width: "100%", maxWidth: "520px", padding: "36px", zIndex: 10 }}>
      
      {/* Onboarding Wizard Header */}
      <div className={styles.onboardingHeader} style={{ marginBottom: "24px" }}>
        <div>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)" }}>
            Setup Wizard (Step {step} of 5)
          </span>
          <h2 style={{ fontFamily: "var(--font-title)", fontSize: "1.25rem", fontWeight: 800, marginTop: "2px", color: "var(--color-text)" }}>
            {step === 1 && "Account Handle & Info"}
            {step === 2 && "First Experience Entry"}
            {step === 3 && "First Education Entry"}
            {step === 4 && "First Project Entry"}
            {step === 5 && "Launch Career Graph"}
          </h2>
        </div>

        {/* Step Progress Indicators */}
        <div className={styles.stepProgress}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`${styles.stepDot} ${step === s ? styles.activeStepDot : ""}`}
              style={{
                background: s < step ? "var(--color-text)" : undefined
              }}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Handle & Name (With Resume Import Dropzone) */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* AI Resume Import Uploader */}
          <div style={{
            background: "var(--color-bg-subtle)",
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            textAlign: "center",
            marginBottom: "4px"
          }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text)", display: "block", marginBottom: "6px" }}>
              ⚡ AI Resume Import
            </span>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: "12px", lineHeight: 1.4 }}>
              Upload your <strong>PDF, DOCX, TXT, or MD</strong> resume and AI will extract all your details automatically.
            </p>
            {resumeParsing ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                <div style={{ width: "14px", height: "14px", border: "2px solid var(--color-border)", borderTopColor: "var(--color-text)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Extracting resume with AI...
              </div>
            ) : (
              <label className="btn-secondary" style={{ 
                display: "inline-flex", 
                padding: "6px 14px", 
                fontSize: "0.75rem", 
                cursor: "pointer",
                borderRadius: "var(--radius-sm)" 
              }}>
                Choose Resume File
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleResumeUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          <div>
            <label className={styles.label}>Profile Handle URL</label>
            <div style={{ position: "relative", marginTop: "4px" }}>
              <span style={{ 
                position: "absolute", 
                left: "14px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--color-text-faint)", 
                fontWeight: "600",
                fontFamily: "var(--font-mono)"
              }}>@</span>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "32px", height: "40px", borderRadius: "var(--radius-md)" }}
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                required
                autoFocus
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Professional Title</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Staff Software Engineer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Biography Bio</label>
            <textarea
              className="form-input"
              style={{ minHeight: "60px", borderRadius: "var(--radius-md)", padding: "10px 12px" }}
              placeholder="Write a brief intro..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={nextStep}
            disabled={!form.username.trim() || !form.fullName.trim() || !form.title.trim()}
            style={{ height: "40px", borderRadius: "var(--radius-md)", marginTop: "8px" }}
          >
            Continue to Experience →
          </button>
        </div>
      )}

      {/* STEP 2: First Experience */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Company Name</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Google"
              value={experience.company}
              onChange={(e) => setExperience({ ...experience, company: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Job Role / Title</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Senior Systems Architect"
              value={experience.role}
              onChange={(e) => setExperience({ ...experience, role: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label className={styles.label}>Start Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "var(--radius-md)" }}
                placeholder="e.g. June 2021"
                value={experience.startDate}
                onChange={(e) => setExperience({ ...experience, startDate: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label className={styles.label}>End Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "var(--radius-md)" }}
                placeholder="e.g. Present"
                value={experience.endDate}
                onChange={(e) => setExperience({ ...experience, endDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Description of Accomplishments</label>
            <textarea
              className="form-input"
              style={{ minHeight: "60px", borderRadius: "var(--radius-md)", padding: "10px 12px" }}
              placeholder="Describe what you built..."
              value={experience.description}
              onChange={(e) => setExperience({ ...experience, description: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={prevStep}
              style={{ flex: 1, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={skipExperience}
              style={{ flex: 1, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              Skip
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={!experience.company.trim() || !experience.role.trim() || !experience.startDate.trim()}
              style={{ flex: 2, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: First Education */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Institution / School</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Stanford University"
              value={education.institution}
              onChange={(e) => setEducation({ ...education, institution: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Degree / Qualification</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Bachelor of Science"
              value={education.degree}
              onChange={(e) => setEducation({ ...education, degree: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Field of Study</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Computer Science"
              value={education.field}
              onChange={(e) => setEducation({ ...education, field: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label className={styles.label}>Start Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "var(--radius-md)" }}
                placeholder="e.g. Sept 2017"
                value={education.startDate}
                onChange={(e) => setEducation({ ...education, startDate: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label className={styles.label}>End Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "var(--radius-md)" }}
                placeholder="e.g. June 2021"
                value={education.endDate}
                onChange={(e) => setEducation({ ...education, endDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={prevStep}
              style={{ flex: 1, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={skipEducation}
              style={{ flex: 1, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              Skip
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={!education.institution.trim() || !education.degree.trim() || !education.startDate.trim()}
              style={{ flex: 2, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: First Project */}
      {step === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Project Title</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Distributed Database Engine"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Technologies (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. Rust, gRPC, Docker, K8s"
              value={project.technologies}
              onChange={(e) => setProject({ ...project, technologies: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Description</label>
            <textarea
              className="form-input"
              style={{ minHeight: "65px", borderRadius: "var(--radius-md)", padding: "10px 12px" }}
              placeholder="What makes this project unique..."
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className={styles.label}>Project URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              style={{ height: "40px", borderRadius: "var(--radius-md)" }}
              placeholder="e.g. https://github.com/..."
              value={project.url}
              onChange={(e) => setProject({ ...project, url: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={prevStep}
              style={{ flex: 1, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={skipProject}
              style={{ flex: 1, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              Skip
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={!project.title.trim() || !project.technologies.trim() || !project.description.trim()}
              style={{ flex: 2, height: "40px", borderRadius: "var(--radius-md)" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Skills & Final Launch */}
      {step === 5 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label className={styles.label}>Core Skills (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "42px", borderRadius: "var(--radius-md)", marginTop: "4px" }}
              placeholder="e.g. TypeScript, React, PostgreSQL, Go, Docker"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              required
              autoFocus
            />
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "6px" }}>
              These tags will be shown as competencies on your responsive teak layout.
            </p>
          </div>

          <div style={{ 
            background: "var(--color-bg-subtle)", 
            border: "1px solid var(--color-border)", 
            borderRadius: "var(--radius-md)", 
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Confirmation Review</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-text)" }}>
              @{form.username.toLowerCase().replace(/[^a-z0-9_-]/g, "")}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
              {form.fullName} &bull; {form.title}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={prevStep}
              style={{ flex: 1, height: "42px", borderRadius: "var(--radius-md)" }}
              disabled={loading}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 2, height: "42px", borderRadius: "var(--radius-md)" }}
              disabled={loading || !skillsString.trim()}
            >
              {loading ? "Launching..." : "Initialize Portfolio 🚀"}
            </button>
          </div>
        </div>
      )}

    </form>
  );
}

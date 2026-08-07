"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { supabase } from "../../services/supabase";

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

  // Multiple parsed entries state
  const [allExperiences, setAllExperiences] = useState<any[]>([]);
  const [allEducation, setAllEducation] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  // Single form entries for step wizard editing
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

  useEffect(() => {
    const loadUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const userEmail = session.user.email;
        const defaultHandle = userEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "");
        setForm((prev) => ({
          ...prev,
          username: prev.username || defaultHandle,
          email: prev.email || userEmail,
        }));
      }
    };
    loadUserEmail();
  }, []);

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

      // Store ALL extracted arrays
      setAllExperiences(exps);
      setAllEducation(edus);
      setAllProjects(projs);

      // Fill profile fields
      setForm((prev) => ({
        username: prev.username || (p.fullName ? p.fullName.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20) : ""),
        fullName: p.fullName || prev.fullName || "",
        title: p.title || prev.title || "",
        bio: p.bio || prev.bio || "",
        email: p.email || prev.email || "",
      }));

      // Fill first experience for wizard preview
      if (exps.length > 0) {
        const e = exps[0];
        setExperience({
          company: e.company || "",
          role: e.role || "",
          startDate: e.startDate || "2022",
          endDate: e.endDate || "",
          description: e.description || "",
        });
      }

      // Fill first education for wizard preview
      if (edus.length > 0) {
        const e = edus[0];
        setEducation({
          institution: e.institution || "",
          degree: e.degree || "",
          field: e.field || "",
          startDate: e.startDate || "2018",
          endDate: e.endDate || "",
        });
      }

      // Fill first project for wizard preview
      if (projs.length > 0) {
        const pr = projs[0];
        setProject({
          title: pr.title || "",
          description: pr.description || "",
          url: pr.url || "",
          technologies: pr.technologies || "TypeScript, React",
        });
      }

      // Fill skills
      if (skills.length > 0) {
        setSkillsString(skills.map((s: any) => s.name).join(", "));
      }

      showStatus(`✅ Resume parsed by AI! Extracted ${projs.length} projects, ${exps.length} experiences, ${edus.length} education, and ${skills.length} skills.`);
    } catch (err: any) {
      setError(err.message || "Resume parsing failed.");
    } finally {
      setResumeParsing(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!form.username.trim() || !form.fullName.trim() || !form.title.trim())) return;
    if (step === 2 && allExperiences.length === 0 && (!experience.company.trim() || !experience.role.trim() || !experience.startDate.trim())) return;
    if (step === 3 && allEducation.length === 0 && (!education.institution.trim() || !education.degree.trim() || !education.startDate.trim())) return;
    if (step === 4 && allProjects.length === 0 && (!project.title.trim() || !project.technologies.trim() || !project.description.trim())) return;
    setStep((s) => (s + 1) as any);
  };

  const prevStep = () => {
    setStep((s) => (s - 1) as any);
  };

  const skipExperience = () => {
    setAllExperiences([]);
    setExperience({ company: "", role: "", startDate: "", endDate: "", description: "" });
    setStep(3);
  };

  const skipEducation = () => {
    setAllEducation([]);
    setEducation({ institution: "", degree: "", field: "", startDate: "", endDate: "" });
    setStep(4);
  };

  const skipProject = () => {
    setAllProjects([]);
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

      // 2. Save ALL Experiences
      const experiencesToSave = allExperiences.length > 0 ? allExperiences : (experience.company ? [experience] : []);
      for (const exp of experiencesToSave) {
        if (exp.company && exp.role) {
          await api.addExperience(cleanUsername, {
            company: exp.company,
            role: exp.role,
            startDate: exp.startDate || "Present",
            endDate: exp.endDate || null,
            description: exp.description || null,
          });
        }
      }

      // 3. Save ALL Education
      const educationToSave = allEducation.length > 0 ? allEducation : (education.institution ? [education] : []);
      for (const edu of educationToSave) {
        if (edu.institution && edu.degree) {
          await api.addEducation(cleanUsername, {
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field || null,
            startDate: edu.startDate || "Present",
            endDate: edu.endDate || null,
          });
        }
      }

      // 4. Save ALL Projects (EVERY SINGLE PARSED PROJECT!)
      const projectsToSave = allProjects.length > 0 ? allProjects : (project.title ? [project] : []);
      for (const proj of projectsToSave) {
        if (proj.title) {
          await api.addProject(cleanUsername, {
            title: proj.title,
            description: proj.description || "Project built by " + form.fullName,
            url: proj.url || null,
            technologies: proj.technologies || "General",
          });
        }
      }

      // 5. Save Skills
      if (skillsString.trim()) {
        const skillsList = skillsString
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        for (const skillName of skillsList) {
          await api.addSkill(cleanUsername, { name: skillName });
        }
      }

      showStatus("🎉 Profile setup complete! Initializing identity studio...");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to initialize profile. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "560px", background: "#ffffff", border: "1.5px solid #e7e4dc", borderRadius: "28px", padding: "40px", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)", margin: "0 auto" }}>
      
      {/* Onboarding Wizard Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#78716c" }}>
            Setup Wizard (Step {step} of 5)
          </span>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "2px", color: "#181616" }}>
            {step === 1 && "Account Handle & Info"}
            {step === 2 && "Experience Entries"}
            {step === 3 && "Education History"}
            {step === 4 && "Projects & Side Pursuits"}
            {step === 5 && "Launch Career Graph"}
          </h2>
        </div>

        {/* Step Progress Indicators */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: s === step ? "#181616" : s < step ? "#047857" : "#e7e4dc"
              }}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Basic Info & Resume Autofill */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* AI Resume Upload Box */}
          <div style={{
            background: "#fbf9f4",
            border: "1.5px dashed #d6d3c9",
            borderRadius: "16px",
            padding: "18px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#181616" }}>
              ⚡ Fast-Track with AI Resume Parsing
            </div>
            <p style={{ fontSize: "0.78rem", color: "#78716c", marginTop: "2px", marginBottom: "12px" }}>
              Upload your PDF/DOCX resume to extract all your profile details, projects, experience, & skills automatically.
            </p>

            {resumeParsing ? (
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#047857" }}>
                ⏳ Extracting projects & resume data with AI...
              </div>
            ) : (
              <label className="btn-secondary" style={{ display: "inline-flex", cursor: "pointer", fontSize: "0.82rem", padding: "8px 16px" }}>
                📄 Select Resume File
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleResumeUpload(f);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Profile Handle URL</label>
            <div style={{ position: "relative", marginTop: "4px" }}>
              <span style={{ 
                position: "absolute", 
                left: "14px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "#a8a29e", 
                fontWeight: "600",
                fontFamily: "var(--font-mono)"
              }}>@</span>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: "32px", height: "40px", borderRadius: "10px" }}
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                required
                autoFocus
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Full Name</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Professional Title</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Staff Software Engineer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Email Address</label>
            <input
              type="email"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Biography Bio</label>
            <textarea
              className="form-input"
              style={{ minHeight: "60px", borderRadius: "10px", padding: "10px 12px" }}
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
            style={{ height: "42px", borderRadius: "10px", marginTop: "8px" }}
          >
            Continue to Experience →
          </button>
        </div>
      )}

      {/* STEP 2: Experience Entries */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {allExperiences.length > 0 && (
            <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "12px", padding: "12px", fontSize: "0.82rem", color: "#047857", fontWeight: 700 }}>
              ✨ AI extracted {allExperiences.length} work experience entries! They will all be saved automatically.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Company Name</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Google"
              value={experience.company}
              onChange={(e) => setExperience({ ...experience, company: e.target.value })}
              required={allExperiences.length === 0}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Job Role / Title</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Senior Systems Architect"
              value={experience.role}
              onChange={(e) => setExperience({ ...experience, role: e.target.value })}
              required={allExperiences.length === 0}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Start Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "10px" }}
                placeholder="e.g. June 2021"
                value={experience.startDate}
                onChange={(e) => setExperience({ ...experience, startDate: e.target.value })}
                required={allExperiences.length === 0}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>End Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "10px" }}
                placeholder="e.g. Present"
                value={experience.endDate}
                onChange={(e) => setExperience({ ...experience, endDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Description of Accomplishments</label>
            <textarea
              className="form-input"
              style={{ minHeight: "60px", borderRadius: "10px", padding: "10px 12px" }}
              placeholder="Describe what you built..."
              value={experience.description}
              onChange={(e) => setExperience({ ...experience, description: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button type="button" className="btn-secondary" onClick={prevStep} style={{ flex: 1, height: "40px", borderRadius: "10px" }}>
              ← Back
            </button>
            <button type="button" className="btn-secondary" onClick={skipExperience} style={{ flex: 1, height: "40px", borderRadius: "10px" }}>
              Skip
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={allExperiences.length === 0 && (!experience.company.trim() || !experience.role.trim() || !experience.startDate.trim())}
              style={{ flex: 2, height: "40px", borderRadius: "10px" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Education History */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {allEducation.length > 0 && (
            <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "12px", padding: "12px", fontSize: "0.82rem", color: "#047857", fontWeight: 700 }}>
              ✨ AI extracted {allEducation.length} education entries! They will all be saved automatically.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Institution / School</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Stanford University"
              value={education.institution}
              onChange={(e) => setEducation({ ...education, institution: e.target.value })}
              required={allEducation.length === 0}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Degree / Qualification</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Bachelor of Science"
              value={education.degree}
              onChange={(e) => setEducation({ ...education, degree: e.target.value })}
              required={allEducation.length === 0}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Field of Study</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Computer Science"
              value={education.field}
              onChange={(e) => setEducation({ ...education, field: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Start Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "10px" }}
                placeholder="e.g. Sept 2017"
                value={education.startDate}
                onChange={(e) => setEducation({ ...education, startDate: e.target.value })}
                required={allEducation.length === 0}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>End Date</label>
              <input
                type="text"
                className="form-input"
                style={{ height: "40px", borderRadius: "10px" }}
                placeholder="e.g. June 2021"
                value={education.endDate}
                onChange={(e) => setEducation({ ...education, endDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button type="button" className="btn-secondary" onClick={prevStep} style={{ flex: 1, height: "40px", borderRadius: "10px" }}>
              ← Back
            </button>
            <button type="button" className="btn-secondary" onClick={skipEducation} style={{ flex: 1, height: "40px", borderRadius: "10px" }}>
              Skip
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={allEducation.length === 0 && (!education.institution.trim() || !education.degree.trim() || !education.startDate.trim())}
              style={{ flex: 2, height: "40px", borderRadius: "10px" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Projects & Side Pursuits */}
      {step === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {allProjects.length > 0 && (
            <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "14px", padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#047857" }}>
                🚀 AI Extracted {allProjects.length} Projects from your resume!
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                {allProjects.map((p, idx) => (
                  <span key={idx} style={{ background: "#ffffff", border: "1px solid #a7f3d0", padding: "3px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, color: "#065f46" }}>
                    ⚡ {p.title}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#047857", marginTop: "4px" }}>
                All {allProjects.length} projects will be saved to your portfolio automatically.
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Project Title</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Distributed Database Engine"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              required={allProjects.length === 0}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Technologies (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. Rust, gRPC, Docker, K8s"
              value={project.technologies}
              onChange={(e) => setProject({ ...project, technologies: e.target.value })}
              required={allProjects.length === 0}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Description</label>
            <textarea
              className="form-input"
              style={{ minHeight: "65px", borderRadius: "10px", padding: "10px 12px" }}
              placeholder="What makes this project unique..."
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              required={allProjects.length === 0}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Project URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              style={{ height: "40px", borderRadius: "10px" }}
              placeholder="e.g. https://github.com/..."
              value={project.url}
              onChange={(e) => setProject({ ...project, url: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button type="button" className="btn-secondary" onClick={prevStep} style={{ flex: 1, height: "40px", borderRadius: "10px" }}>
              ← Back
            </button>
            <button type="button" className="btn-secondary" onClick={skipProject} style={{ flex: 1, height: "40px", borderRadius: "10px" }}>
              Skip
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={nextStep}
              disabled={allProjects.length === 0 && (!project.title.trim() || !project.technologies.trim() || !project.description.trim())}
              style={{ flex: 2, height: "40px", borderRadius: "10px" }}
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
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#181616" }}>Core Skills (Comma-separated)</label>
            <input
              type="text"
              className="form-input"
              style={{ height: "42px", borderRadius: "10px", marginTop: "4px" }}
              placeholder="e.g. TypeScript, React, PostgreSQL, Go, Docker"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              required
              autoFocus
            />
            <p style={{ fontSize: "0.75rem", color: "#78716c", marginTop: "6px" }}>
              These competencies will feed directly into your public portfolio and AI MCP client.
            </p>
          </div>

          <div style={{ 
            background: "#fbf9f4", 
            border: "1px solid #e7e4dc", 
            borderRadius: "14px", 
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ fontSize: "0.72rem", color: "#78716c", textTransform: "uppercase", fontWeight: 700 }}>Confirmation Review</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#181616" }}>
              @{form.username.toLowerCase().replace(/[^a-z0-9_-]/g, "")}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#78716c" }}>
              {form.fullName} &bull; {form.title}
            </div>
            {allProjects.length > 0 && (
              <div style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700, marginTop: "4px" }}>
                🚀 Ready to save {allProjects.length} projects, {allExperiences.length} experiences, and {allEducation.length} education entries!
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={prevStep}
              style={{ flex: 1, height: "42px", borderRadius: "10px" }}
              disabled={loading}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 2, height: "42px", borderRadius: "10px" }}
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

"use client";

import { useEffect, useState, use } from "react";
import { api, Profile } from "../../../services/api";
import styles from "./page.module.css";
import Link from "next/link";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  GlobeIcon,
  ExternalLinkIcon
} from "@radix-ui/react-icons";

interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

type PortfolioTab = "all" | "work" | "projects" | "education";

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PortfolioTab>("all");

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getProfile(username);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#FAF8F5" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #E7E5E4", borderTopColor: "#1C1917", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#FAF8F5", padding: "20px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E7E5E4", padding: "40px", borderRadius: "24px", maxWidth: "480px", width: "100%", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#991b1b", marginBottom: "12px" }}>
            Portfolio Not Found
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#78716C", marginBottom: "24px", lineHeight: 1.6 }}>
            We couldn&apos;t load the portfolio for <strong>@{username}</strong>. Make sure this profile has been created in the dashboard builder first.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href={`/dashboard?username=${username}`} style={{ padding: "10px 18px", background: "#18181B", color: "#FFF", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
              Go to Dashboard
            </Link>
            <Link href="/" style={{ padding: "10px 18px", background: "#F4F1EA", color: "#1C1917", borderRadius: "100px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.portfolioWrapper}>
      
      {/* Main Single Column Canvas */}
      <main className={styles.mainContainer}>
        
        {/* Sub Navigation Tabs */}
        <div className={styles.subTabs}>
          <button
            onClick={() => setActiveTab("all")}
            className={`${styles.subTabBtn} ${activeTab === "all" ? styles.subTabBtnActive : ""}`}
          >
            {activeTab === "all" && <span className={styles.activeDot} />} Home
          </button>
          <button
            onClick={() => setActiveTab("work")}
            className={`${styles.subTabBtn} ${activeTab === "work" ? styles.subTabBtnActive : ""}`}
          >
            {activeTab === "work" && <span className={styles.activeDot} />} Work
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`${styles.subTabBtn} ${activeTab === "projects" ? styles.subTabBtnActive : ""}`}
          >
            {activeTab === "projects" && <span className={styles.activeDot} />} Projects
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`${styles.subTabBtn} ${activeTab === "education" ? styles.subTabBtnActive : ""}`}
          >
            {activeTab === "education" && <span className={styles.activeDot} />} Education & Skills
          </button>
        </div>

        {/* Hero Section */}
        <header className={styles.heroBlock}>
          <div className={styles.heroNameMeta}>
            <span>{profile.fullName}</span> • <span>@{profile.username}</span>
          </div>

          <h1 className={styles.heroSerifTitle}>
            {profile.title || profile.fullName}
          </h1>

          {profile.bio && (
            <p className={styles.heroBioText}>
              {profile.bio}
            </p>
          )}

          {/* Social Contact Pills */}
          <div className={styles.socialLinksRow}>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className={styles.socialLinkPill}>
                <EnvelopeClosedIcon /> Email
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className={styles.socialLinkPill}>
                <GitHubLogoIcon /> GitHub
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLinkPill}>
                <LinkedInLogoIcon /> LinkedIn
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className={styles.socialLinkPill}>
                <GlobeIcon /> Website
              </a>
            )}
          </div>
        </header>

        {/* Sections Stack */}
        <div className={styles.sectionsStack}>

          {/* WORK EXPERIENCES SECTION */}
          {(activeTab === "all" || activeTab === "work") && (
            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>EXPERIENCE</span>
                <span style={{ fontSize: "0.75rem", color: "#A8A29E" }}>{profile.experiences.length} roles</span>
              </div>

              {profile.experiences.length > 0 ? (
                <div className={styles.cardList}>
                  {profile.experiences.map((exp) => (
                    <div key={exp.id} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <div>
                          <h3 className={styles.itemTitle}>{exp.role}</h3>
                          <div className={styles.itemSubtitle}>{exp.company}</div>
                        </div>
                        <span className={styles.dateBadge}>{exp.startDate} – {exp.endDate || "Present"}</span>
                      </div>
                      {exp.description && (
                        <p className={styles.itemDesc}>{exp.description}</p>
                      )}
                      <div className={styles.tagContainer}>
                        <span className={styles.pillTag}>FULL-TIME</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No work experiences added yet.</div>
              )}
            </section>
          )}

          {/* PROJECTS SECTION */}
          {(activeTab === "all" || activeTab === "projects") && (
            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>PROJECTS</span>
                <span style={{ fontSize: "0.75rem", color: "#A8A29E" }}>{profile.projects.length} projects</span>
              </div>

              {profile.projects.length > 0 ? (
                <div className={styles.gridProjects}>
                  {profile.projects.map((proj) => (
                    <div key={proj.id} className={styles.itemCard}>
                      <div>
                        <div className={styles.itemHeader} style={{ marginBottom: "8px" }}>
                          <h3 className={styles.itemTitle}>{proj.title}</h3>
                          {proj.url && (
                            <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ color: "#1C1917", display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "0.8rem" }}>
                              <ExternalLinkIcon />
                            </a>
                          )}
                        </div>
                        <p className={styles.itemDesc} style={{ marginBottom: "14px" }}>{proj.description}</p>
                      </div>
                      
                      <div className={styles.tagContainer}>
                        {proj.technologies.split(",").map((tech) => (
                          <span key={tech} className={styles.pillTag}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No projects added yet.</div>
              )}
            </section>
          )}

          {/* EDUCATION SECTION */}
          {(activeTab === "all" || activeTab === "education") && (
            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>EDUCATION</span>
                <span style={{ fontSize: "0.75rem", color: "#A8A29E" }}>{profile.education.length} degrees</span>
              </div>

              {profile.education.length > 0 ? (
                <div className={styles.cardList}>
                  {profile.education.map((edu) => (
                    <div key={edu.id} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <div>
                          <h3 className={styles.itemTitle}>{edu.degree}</h3>
                          <div className={styles.itemSubtitle}>{edu.institution} {edu.field && `• ${edu.field}`}</div>
                        </div>
                        <span className={styles.dateBadge}>{edu.startDate} – {edu.endDate || "Present"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No education details added yet.</div>
              )}
            </section>
          )}

          {/* SKILLS SECTION */}
          {(activeTab === "all" || activeTab === "education") && (
            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>TECHNICAL SKILLS</span>
                <span style={{ fontSize: "0.75rem", color: "#A8A29E" }}>{profile.skills.length} skills</span>
              </div>

              {profile.skills.length > 0 ? (
                <div className={styles.tagContainer} style={{ marginTop: "4px" }}>
                  {profile.skills.map((skill) => (
                    <span key={skill.id} className={`${styles.pillTag} ${styles.pillTagAccent}`} style={{ padding: "6px 16px", fontSize: "0.82rem" }}>
                      {skill.name} {skill.category && <span style={{ opacity: 0.6, fontSize: "0.72rem", marginLeft: "4px" }}>({skill.category})</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No skills added yet.</div>
              )}
            </section>
          )}

        </div>

        {/* Footer: Made with IdentityGraph */}
        <footer className={styles.publicFooter}>
          <Link href="/" target="_blank" rel="noopener noreferrer" className={styles.madeWithLink}>
            <span>Made with</span>
            <span className={styles.brandName}>IdentityGraph</span>
          </Link>
        </footer>

      </main>

    </div>
  );
}

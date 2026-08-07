"use client";

import { useEffect, useState, use } from "react";
import { api, Profile } from "../../../services/api";
import styles from "./page.module.css";
import Link from "next/link";
import { Flex, Grid, Text } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface PortfolioPageProps {
  params: Promise<{ username: string }>;
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <Flex justify="center" align="center" style={{ minHeight: "100vh", background: "#050505" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255, 255, 255, 0.05)", borderTopColor: "#d94e4e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </Flex>
    );
  }

  if (error || !profile) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "100vh", background: "#050505", padding: "20px", color: "#fff" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "40px", borderRadius: "12px", maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <Text size="5" weight="bold" color="red" style={{ display: "block", marginBottom: "12px" }}>
            Portfolio Not Found
          </Text>
          <Text size="2" color="gray" style={{ display: "block", marginBottom: "24px", lineHeight: "1.6" }}>
            We couldn&apos;t load the portfolio for <strong>@{username}</strong>. Make sure this profile has been created in the builder dashboard first.
          </Text>
          <Flex gap="3" justify="center">
            <Link href={`/dashboard?username=${username}`} className="btn-primary" style={{ textDecoration: "none", fontSize: "0.85rem" }}>
              Go to Dashboard
            </Link>
            <Link href="/" className="btn-secondary" style={{ textDecoration: "none", fontSize: "0.85rem" }}>
              Back to Home
            </Link>
          </Flex>
        </div>
      </Flex>
    );
  }

  return (
    <div className={`${styles.portfolioWrapper} ${styles.teakWrapper}`}>
      
      {/* Floating Back Button */}
      <Link href={`/dashboard?username=${username}`} className={styles.btnBack}>
        <ArrowLeftIcon /> back to dashboard
      </Link>

      <div className={styles.portfolioContainer}>
        
        {/* ==========================================
            HEADER / HERO SECTION
           ========================================== */}
        <header className={styles.teakHeader}>
          <h1>{profile.fullName}</h1>
          <div className={styles.teakHeaderTitle}>{profile.title}</div>
          
          {profile.bio && (
            <p className={styles.teakHeaderBio}>
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          <Flex gap="3" wrap="wrap" style={{ marginTop: "24px" }}>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className={styles.teakContact}>
                email
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className={styles.teakContact}>
                website
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className={styles.teakContact}>
                github
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.teakContact}>
                linkedin
              </a>
            )}
          </Flex>
        </header>

        {/* ==========================================
            EXPERIENCES SECTION
           ========================================== */}
        {profile.experiences.length > 0 && (
          <section className={styles.teakSection}>
            <h2>Experience</h2>
            <Flex direction="column" gap="4">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className={styles.teakCard}>
                  <Flex justify="between" align="start" style={{ marginBottom: "6px" }}>
                    <h3>{exp.role}</h3>
                    <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{exp.startDate} – {exp.endDate || "Present"}</span>
                  </Flex>
                  <div className={styles.teakMeta}>{exp.company}</div>
                  {exp.description && (
                    <p className={styles.teakDesc}>{exp.description}</p>
                  )}
                </div>
              ))}
            </Flex>
          </section>
        )}

        {/* ==========================================
            PROJECTS SECTION
           ========================================== */}
        {profile.projects.length > 0 && (
          <section className={styles.teakSection}>
            <h2>Projects</h2>
            
            <Grid columns={{ initial: "1", sm: "2" }} gap="4">
              {profile.projects.map((proj) => (
                <div key={proj.id} className={styles.teakCard} style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Flex justify="between" align="start" style={{ marginBottom: "10px" }}>
                      <h3>{proj.title}</h3>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noopener noreferrer" className={styles.teakContact} style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                          link ↗
                        </a>
                      )}
                    </Flex>
                    <p className={styles.teakDesc} style={{ marginBottom: "15px" }}>{proj.description}</p>
                  </div>
                  <Flex gap="2" wrap="wrap" style={{ marginTop: "auto" }}>
                    {proj.technologies.split(",").map((tech) => (
                      <span key={tech} className={styles.teakSkill} style={{ fontSize: "0.7rem", padding: "4px 10px" }}>
                        {tech.trim()}
                      </span>
                    ))}
                  </Flex>
                </div>
              ))}
            </Grid>
          </section>
        )}

        {/* ==========================================
            EDUCATION SECTION
           ========================================== */}
        {profile.education.length > 0 && (
          <section className={styles.teakSection}>
            <h2>Education</h2>
            <Flex direction="column" gap="4">
              {profile.education.map((edu) => (
                <div key={edu.id} className={styles.teakCard}>
                  <Flex justify="between" align="start" style={{ marginBottom: "6px" }}>
                    <h3>{edu.degree}</h3>
                    <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{edu.startDate} – {edu.endDate || "Present"}</span>
                  </Flex>
                  <div className={styles.teakMeta} style={{ marginBottom: 0 }}>
                    {edu.institution} {edu.field && `• ${edu.field}`}
                  </div>
                </div>
              ))}
            </Flex>
          </section>
        )}

        {/* ==========================================
            SKILLS SECTION
           ========================================== */}
        {profile.skills.length > 0 && (
          <section className={styles.teakSection}>
            <h2>Skills</h2>
            <Flex gap="2" wrap="wrap" style={{ marginTop: "10px" }}>
              {profile.skills.map((skill) => (
                <span key={skill.id} className={styles.teakSkill}>
                  {skill.name}
                </span>
              ))}
            </Flex>
          </section>
        )}

      </div>
    </div>
  );
}

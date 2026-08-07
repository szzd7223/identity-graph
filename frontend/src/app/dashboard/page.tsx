"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { ProfileSetupForm } from "../../components/dashboard/ProfileSetupForm";
import { OverviewTab } from "../../components/dashboard/OverviewTab";
import { ExperiencesTab } from "../../components/dashboard/ExperiencesTab";
import { EducationTab } from "../../components/dashboard/EducationTab";
import { ProjectsTab } from "../../components/dashboard/ProjectsTab";
import { SkillsTab } from "../../components/dashboard/SkillsTab";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { StatusBar } from "../../components/ui/StatusBar";
import styles from "./page.module.css";

type Tab = "overview" | "experiences" | "education" | "projects" | "skills";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const TAB_TITLES: Record<Tab, string> = {
  overview: "General Details & Theme Layout",
  experiences: "Professional Experiences",
  education: "Education History",
  projects: "Projects & Side Pursuits",
  skills: "Skills & Competencies",
};

export default function DashboardPage({ searchParams }: PageProps) {
  use(searchParams);
  const { signOut } = useAuth();
  const { profile, setError, username, loading, error, statusMessage, profileNotFound, showStatus, fetchProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleTabChange = (tab: Tab) => setActiveTab(tab);

  return (
    <div className={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : profileNotFound ? (
        <ProfileSetupForm onCreated={fetchProfile} setError={setError} showStatus={showStatus} />
      ) : profile ? (
        <div className={styles.dashboardWrapper}>
          <DashboardSidebar
            profile={profile}
            username={username}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onSignOut={signOut}
          />

          <main className={styles.mainContent}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.headerTitle}>
                  {TAB_TITLES[activeTab]}
                </h1>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.82rem", marginTop: "6px", lineHeight: 1.5 }}>
                  Manage the data that feeds directly into your public portfolio layouts and AI MCP client.
                </p>
              </div>
              <StatusBar statusMessage={statusMessage} error={error} onDismissError={() => setError(null)} />
            </div>

            {activeTab === "overview" && <OverviewTab profile={profile} username={username} onSaved={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("experiences")} />}
            {activeTab === "experiences" && <ExperiencesTab experiences={profile.experiences} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("education")} />}
            {activeTab === "education" && <EducationTab education={profile.education} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("projects")} />}
            {activeTab === "projects" && <ProjectsTab projects={profile.projects} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("skills")} />}
            {activeTab === "skills" && <SkillsTab skills={profile.skills} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} />}
          </main>
        </div>
      ) : null}
    </div>
  );
}

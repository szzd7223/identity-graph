"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { DashboardSkeleton, DashboardTab } from "../../components/dashboard/DashboardSkeleton";
import { OverviewTab } from "../../components/dashboard/OverviewTab";
import { ExperiencesTab } from "../../components/dashboard/ExperiencesTab";
import { EducationTab } from "../../components/dashboard/EducationTab";
import { ProjectsTab } from "../../components/dashboard/ProjectsTab";
import { SkillsTab } from "../../components/dashboard/SkillsTab";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { StatusBar } from "../../components/ui/StatusBar";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const TAB_TITLES: Record<DashboardTab, string> = {
  overview: "General Details & Bio",
  experiences: "Professional Experiences",
  education: "Education History",
  projects: "Projects & Side Pursuits",
  skills: "Skills & Competencies",
};

export default function DashboardPage({ searchParams }: PageProps) {
  use(searchParams);
  const router = useRouter();
  const { session, loading: authLoading, signOut } = useAuth();
  const { profile, setError, username, loading: profileLoading, error, statusMessage, profileNotFound, showStatus, fetchProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace("/login");
    } else if (session) {
      fetchProfile();
    }
  }, [session, authLoading, fetchProfile, router]);

  useEffect(() => {
    if (!authLoading && !profileLoading && profileNotFound) {
      router.replace("/onboarding");
    }
  }, [profileNotFound, profileLoading, authLoading, router]);

  const handleTabChange = (tab: DashboardTab) => setActiveTab(tab);

  if (authLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (!session || profileNotFound) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fbf9f4" }}>
      {profile ? (
        <DashboardSkeleton
          profile={profile}
          username={username}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSignOut={signOut}
        >
          {/* Main Content Workspace Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e7e4dc", paddingBottom: "16px" }}>
              <div>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#181616" }}>
                  {TAB_TITLES[activeTab]}
                </h1>
                <p style={{ color: "#78716c", fontSize: "0.85rem", marginTop: "4px", lineHeight: 1.5 }}>
                  Manage the verified data that feeds directly into your public web portfolio and AI MCP client.
                </p>
              </div>
              <StatusBar statusMessage={statusMessage} error={error} onDismissError={() => setError(null)} />
            </div>

            {/* Active Tab Component */}
            {activeTab === "overview" && <OverviewTab profile={profile} username={username} onSaved={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("experiences")} />}
            {activeTab === "experiences" && <ExperiencesTab experiences={profile.experiences} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("education")} />}
            {activeTab === "education" && <EducationTab education={profile.education} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("projects")} />}
            {activeTab === "projects" && <ProjectsTab projects={profile.projects} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} onNext={() => setActiveTab("skills")} />}
            {activeTab === "skills" && <SkillsTab skills={profile.skills} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} />}
          </div>
        </DashboardSkeleton>
      ) : null}
    </div>
  );
}

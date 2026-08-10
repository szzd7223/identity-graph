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
          {/* Main Continuous Form Workspace */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Header & Status Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e7e4dc", paddingBottom: "14px" }}>
              <div>
                <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#181616" }}>
                  Profile Builder & Data Substrate
                </h1>
                <p style={{ color: "#78716c", fontSize: "0.85rem", marginTop: "4px", lineHeight: 1.5 }}>
                  Edit your verified career details below. Changes are saved and synchronized automatically with your public portfolio and AI tools.
                </p>
              </div>
              <StatusBar statusMessage={statusMessage} error={error} onDismissError={() => setError(null)} />
            </div>

            {/* Section 1: Overview & Bio */}
            <div id="section-overview" style={{ scrollMarginTop: "130px" }}>
              <OverviewTab profile={profile} username={username} onSaved={fetchProfile} showStatus={showStatus} setError={setError} />
            </div>

            {/* Section 2: Experience */}
            <div id="section-experiences" style={{ scrollMarginTop: "130px" }}>
              <ExperiencesTab experiences={profile.experiences} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} />
            </div>

            {/* Section 3: Education */}
            <div id="section-education" style={{ scrollMarginTop: "130px" }}>
              <EducationTab education={profile.education} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} />
            </div>

            {/* Section 4: Projects */}
            <div id="section-projects" style={{ scrollMarginTop: "130px" }}>
              <ProjectsTab projects={profile.projects} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} />
            </div>

            {/* Section 5: Skills */}
            <div id="section-skills" style={{ scrollMarginTop: "130px" }}>
              <SkillsTab skills={profile.skills} username={username} onMutated={fetchProfile} showStatus={showStatus} setError={setError} />
            </div>

          </div>
        </DashboardSkeleton>
      ) : null}
    </div>
  );
}

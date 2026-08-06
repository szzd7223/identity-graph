"use client";

import React from "react";
import Link from "next/link";
import { Profile } from "../../services/api";
import { ThemeToggle } from "../ui/ThemeToggle";
import styles from "../../app/dashboard/page.module.css";

type Tab = "overview" | "experiences" | "education" | "projects" | "skills";

interface DashboardSidebarProps {
  profile: Profile | null;
  username: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSignOut: () => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview & Theme" },
  { id: "experiences", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

export function DashboardSidebar({ profile, username, activeTab, onTabChange, onSignOut }: DashboardSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.userCard}>
        <div className={styles.avatar}>
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
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.activeNavItem : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
        {profile && (
          <Link
            href={`/portfolio/${username}`}
            target="_blank"
            className="btn-ghost"
            style={{ fontSize: "0.8rem" }}
          >
            View Portfolio ↗
          </Link>
        )}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            onClick={onSignOut}
            className="btn-ghost"
            style={{ flex: 1, justifyContent: "flex-start" }}
          >
            Sign Out
          </button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

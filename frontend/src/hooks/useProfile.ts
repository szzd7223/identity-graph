"use client";

import { useState, useCallback } from "react";
import { api, Profile } from "../services/api";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setProfileNotFound(false);
    try {
      const data = await api.getMyProfile();
      setProfile(data);
      setUsername(data.username);
    } catch (err: any) {
      if (err.message && err.message.includes("PROFILE_NOT_FOUND")) {
        setProfile(null);
        setProfileNotFound(true);
      } else {
        setError(err.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    setProfile,
    username,
    loading,
    setLoading,
    error,
    setError,
    statusMessage,
    profileNotFound,
    showStatus,
    fetchProfile,
  };
}

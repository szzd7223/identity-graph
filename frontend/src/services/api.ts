import { supabase } from "./supabase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string | null;
  technologies: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string | null;
}

export interface Profile {
  id: string;
  username: string;
  fullName: string;
  title: string;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  theme?: string | null; // We can add a custom theme selection field
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  };

  if (session?.access_token) {
    (headers as any)["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    // Prevent Next.js from caching GET requests during editing
    cache: "no-store",
  });

  if (!res.ok) {
    let errorMsg = `API Request failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      // Ignored
    }
    throw new Error(errorMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Profiles
  getMyProfile: () => request<Profile>("/profiles/me"),
  getProfile: (username: string) => request<Profile>(`/profiles/${username}`),
  createProfile: (data: Partial<Profile>) =>
    request<Profile>("/profiles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProfile: (username: string, data: Partial<Profile>) =>
    request<Profile>(`/profiles/${username}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Experiences
  addExperience: (username: string, data: Partial<Experience>) =>
    request<Experience>(`/profiles/${username}/experiences`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateExperience: (id: string, data: Partial<Experience>) =>
    request<Experience>(`/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteExperience: (id: string) =>
    request<{ message: string }>(`/experiences/${id}`, {
      method: "DELETE",
    }),

  // Education
  addEducation: (username: string, data: Partial<Education>) =>
    request<Education>(`/profiles/${username}/education`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEducation: (id: string, data: Partial<Education>) =>
    request<Education>(`/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteEducation: (id: string) =>
    request<{ message: string }>(`/education/${id}`, {
      method: "DELETE",
    }),

  // Projects
  addProject: (username: string, data: Partial<Project>) =>
    request<Project>(`/profiles/${username}/projects`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    request<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
    }),

  // Skills
  addSkill: (username: string, data: Partial<Skill>) =>
    request<Skill>(`/profiles/${username}/skills`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSkill: (id: string, data: Partial<Skill>) =>
    request<Skill>(`/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSkill: (id: string) =>
    request<{ message: string }>(`/skills/${id}`, {
      method: "DELETE",
    }),

  // AI Resume Parsing
  parseResume: async (file: File): Promise<any> => {
    const { data: { session } } = await supabase.auth.getSession();
    const formData = new FormData();
    formData.append("resume", file);

    const headers: HeadersInit = {};
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const res = await fetch(`${API_BASE_URL}/parse-resume`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = `Resume parsing failed: ${res.statusText}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.error || errorMsg;
      } catch { /* ignored */ }
      throw new Error(errorMsg);
    }

    return res.json();
  },
};

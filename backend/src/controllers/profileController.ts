import { Request, Response } from "express";
import { prisma } from "../db.js";
import { AuthRequest } from "../middleware/auth.js";

async function verifyProfileOwner(username: string, req: Request): Promise<string | null> {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) return null;

  const profile = await prisma.profile.findUnique({ where: { username } });
  if (!profile || profile.id !== userId) return null;

  return profile.id;
}

async function verifyExperienceOwner(id: string, req: Request): Promise<boolean> {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) return false;
  const item = await prisma.experience.findUnique({
    where: { id },
    select: { profile: { select: { id: true } } }
  });
  return item?.profile?.id === userId;
}

async function verifyEducationOwner(id: string, req: Request): Promise<boolean> {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) return false;
  const item = await prisma.education.findUnique({
    where: { id },
    select: { profile: { select: { id: true } } }
  });
  return item?.profile?.id === userId;
}

async function verifyProjectOwner(id: string, req: Request): Promise<boolean> {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) return false;
  const item = await prisma.project.findUnique({
    where: { id },
    select: { profile: { select: { id: true } } }
  });
  return item?.profile?.id === userId;
}

async function verifySkillOwner(id: string, req: Request): Promise<boolean> {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) return false;
  const item = await prisma.skill.findUnique({
    where: { id },
    select: { profile: { select: { id: true } } }
  });
  return item?.profile?.id === userId;
}

// ==========================================
// PROFILE CONTROLLERS
// ==========================================

// Get a complete profile by username (with all relations)
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params as { username: string };

  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        experiences: true,
        education: true,
        projects: true,
        skills: true
      }
    });

    if (!profile) {
      res.status(404).json({ error: `Profile not found for username: ${username}` });
      return;
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
};

// Get the currently authenticated user's profile
export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User session missing." });
    return;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      include: {
        experiences: true,
        education: true,
        projects: true,
        skills: true
      }
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found", code: "PROFILE_NOT_FOUND" });
      return;
    }

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch own profile", details: error.message });
  }
};

// Create a new profile
export const createProfile = async (req: Request, res: Response): Promise<void> => {
  const { username, fullName, title, bio, email, phone, website, github, linkedin, theme } = req.body;
  const userId = (req as AuthRequest).user?.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User session missing." });
    return;
  }

  if (!username || !fullName || !title) {
    res.status(400).json({ error: "Username, full name, and title are required fields." });
    return;
  }

  try {
    const existing = await prisma.profile.findUnique({ where: { username } });
    if (existing) {
      res.status(400).json({ error: `Username '${username}' is already taken.` });
      return;
    }

    const profile = await prisma.profile.create({
      data: {
        id: userId,
        username,
        fullName,
        title,
        bio,
        email,
        phone,
        website,
        github,
        linkedin,
        theme: theme || "minimalist"
      }
    });

    res.status(201).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create profile", details: error.message });
  }
};

// Update profile details
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params as { username: string };
  const { fullName, title, bio, email, phone, website, github, linkedin, theme } = req.body;

  try {
    const ownerId = await verifyProfileOwner(username, req);
    if (!ownerId) {
      res.status(403).json({ error: "Forbidden. You do not own this profile." });
      return;
    }

    const profile = await prisma.profile.update({
      where: { username },
      data: {
        fullName,
        title,
        bio,
        email,
        phone,
        website,
        github,
        linkedin,
        theme
      }
    });

    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
};

// ==========================================
// EXPERIENCE CONTROLLERS
// ==========================================

export const addExperience = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params as { username: string };
  const { company, role, startDate, endDate, description } = req.body;

  if (!company || !role || !startDate) {
    res.status(400).json({ error: "Company, role, and startDate are required." });
    return;
  }

  try {
    const profileId = await verifyProfileOwner(username, req);
    if (!profileId) {
      res.status(403).json({ error: "Forbidden. You do not own this profile." });
      return;
    }

    const experience = await prisma.experience.create({
      data: {
        profileId,
        company,
        role,
        startDate,
        endDate,
        description
      }
    });

    res.status(201).json(experience);
    syncProfileToHydra(profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to add experience", details: error.message });
  }
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const { company, role, startDate, endDate, description } = req.body;

  try {
    const isOwner = await verifyExperienceOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        company,
        role,
        startDate,
        endDate,
        description
      }
    });

    res.json(experience);
    syncProfileToHydra(experience.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update experience", details: error.message });
  }
};

export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };

  try {
    const isOwner = await verifyExperienceOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const item = await prisma.experience.findUnique({ where: { id }, select: { profileId: true } });
    await prisma.experience.delete({ where: { id } });
    res.json({ message: "Experience deleted successfully" });
    if (item?.profileId) syncProfileToHydra(item.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete experience", details: error.message });
  }
};

// ==========================================
// EDUCATION CONTROLLERS
// ==========================================

export const addEducation = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params as { username: string };
  const { institution, degree, field, startDate, endDate } = req.body;

  if (!institution || !degree || !startDate) {
    res.status(400).json({ error: "Institution, degree, and startDate are required." });
    return;
  }

  try {
    const profileId = await verifyProfileOwner(username, req);
    if (!profileId) {
      res.status(403).json({ error: "Forbidden. You do not own this profile." });
      return;
    }

    const education = await prisma.education.create({
      data: {
        profileId,
        institution,
        degree,
        field,
        startDate,
        endDate
      }
    });

    res.status(201).json(education);
    syncProfileToHydra(profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to add education", details: error.message });
  }
};

export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const { institution, degree, field, startDate, endDate } = req.body;

  try {
    const isOwner = await verifyEducationOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const education = await prisma.education.update({
      where: { id },
      data: {
        institution,
        degree,
        field,
        startDate,
        endDate
      }
    });

    res.json(education);
    syncProfileToHydra(education.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update education", details: error.message });
  }
};

export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };

  try {
    const isOwner = await verifyEducationOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const item = await prisma.education.findUnique({ where: { id }, select: { profileId: true } });
    await prisma.education.delete({ where: { id } });
    res.json({ message: "Education deleted successfully" });
    if (item?.profileId) syncProfileToHydra(item.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete education", details: error.message });
  }
};

// ==========================================
// PROJECT CONTROLLERS
// ==========================================

export const addProject = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params as { username: string };
  const { title, description, url, technologies } = req.body;

  if (!title || !description || !technologies) {
    res.status(400).json({ error: "Title, description, and technologies are required." });
    return;
  }

  try {
    const profileId = await verifyProfileOwner(username, req);
    if (!profileId) {
      res.status(403).json({ error: "Forbidden. You do not own this profile." });
      return;
    }

    const project = await prisma.project.create({
      data: {
        profileId,
        title,
        description,
        url,
        technologies
      }
    });

    res.status(201).json(project);
    syncProfileToHydra(profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to add project", details: error.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const { title, description, url, technologies } = req.body;

  try {
    const isOwner = await verifyProjectOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        url,
        technologies
      }
    });

    res.json(project);
    syncProfileToHydra(project.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update project", details: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };

  try {
    const isOwner = await verifyProjectOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const item = await prisma.project.findUnique({ where: { id }, select: { profileId: true } });
    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted successfully" });
    if (item?.profileId) syncProfileToHydra(item.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete project", details: error.message });
  }
};

// ==========================================
// SKILL CONTROLLERS
// ==========================================

export const addSkill = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params as { username: string };
  const { name, category } = req.body;

  if (!name) {
    res.status(400).json({ error: "Skill name is required." });
    return;
  }

  try {
    const profileId = await verifyProfileOwner(username, req);
    if (!profileId) {
      res.status(403).json({ error: "Forbidden. You do not own this profile." });
      return;
    }

    const skill = await prisma.skill.create({
      data: {
        profileId,
        name,
        category
      }
    });

    res.status(201).json(skill);
    syncProfileToHydra(profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to add skill", details: error.message });
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const { name, category } = req.body;

  try {
    const isOwner = await verifySkillOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category
      }
    });

    res.json(skill);
    syncProfileToHydra(skill.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update skill", details: error.message });
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };

  try {
    const isOwner = await verifySkillOwner(id, req);
    if (!isOwner) {
      res.status(403).json({ error: "Forbidden. You do not own this record." });
      return;
    }

    const item = await prisma.skill.findUnique({ where: { id }, select: { profileId: true } });
    await prisma.skill.delete({ where: { id } });
    res.json({ message: "Skill deleted successfully" });
    if (item?.profileId) syncProfileToHydra(item.profileId).catch(console.error);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete skill", details: error.message });
  }
};

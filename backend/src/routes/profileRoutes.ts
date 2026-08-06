import { Router } from "express";
import {
  getProfile,
  getMyProfile,
  createProfile,
  updateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addProject,
  updateProject,
  deleteProject,
  addSkill,
  updateSkill,
  deleteSkill
} from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Profile CRUD routes
router.get("/profiles/me", requireAuth, getMyProfile);
router.get("/profiles/:username", getProfile);
router.post("/profiles", requireAuth, createProfile);
router.put("/profiles/:username", requireAuth, updateProfile);

// Experiences CRUD routes
router.post("/profiles/:username/experiences", requireAuth, addExperience);
router.put("/experiences/:id", requireAuth, updateExperience);
router.delete("/experiences/:id", requireAuth, deleteExperience);

// Education CRUD routes
router.post("/profiles/:username/education", requireAuth, addEducation);
router.put("/education/:id", requireAuth, updateEducation);
router.delete("/education/:id", requireAuth, deleteEducation);

// Projects CRUD routes
router.post("/profiles/:username/projects", requireAuth, addProject);
router.put("/projects/:id", requireAuth, updateProject);
router.delete("/projects/:id", requireAuth, deleteProject);

// Skills CRUD routes
router.post("/profiles/:username/skills", requireAuth, addSkill);
router.put("/skills/:id", requireAuth, updateSkill);
router.delete("/skills/:id", requireAuth, deleteSkill);

export default router;

import { Router } from "express";
import {
  getProfile,
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

const router = Router();

// Profile CRUD routes
router.get("/profiles/:username", getProfile);
router.post("/profiles", createProfile);
router.put("/profiles/:username", updateProfile);

// Experiences CRUD routes
router.post("/profiles/:username/experiences", addExperience);
router.put("/experiences/:id", updateExperience);
router.delete("/experiences/:id", deleteExperience);

// Education CRUD routes
router.post("/profiles/:username/education", addEducation);
router.put("/education/:id", updateEducation);
router.delete("/education/:id", deleteEducation);

// Projects CRUD routes
router.post("/profiles/:username/projects", addProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Skills CRUD routes
router.post("/profiles/:username/skills", addSkill);
router.put("/skills/:id", updateSkill);
router.delete("/skills/:id", deleteSkill);

export default router;

import { Router } from "express";
import { getProjects, createProjects, deleteProject, getProjectById } from "../controllers/projectController";

const router = Router();
router.get("/", getProjects);
router.get("/:projectId", getProjectById);
router.post("/", createProjects);
router.delete("/:projectId", deleteProject)

export const projectRoutes = router;
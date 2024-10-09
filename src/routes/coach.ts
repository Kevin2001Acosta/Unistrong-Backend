import { Router, Request, Response } from "express";
import CoachController from "../controllers/coach.controller";

const router = Router();

router.post("/register", CoachController.createCoach);
router.get("/", CoachController.getAllCoaches);
router.get("/:id", CoachController.getCoachById);
router.get("/:id/clients", CoachController.getClientsByCoachId);

export { router };

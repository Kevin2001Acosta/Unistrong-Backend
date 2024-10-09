import { Router, Request, Response } from "express";
import RoutineController from "../controllers/routines.controller";

const router = Router();

router.post("/register", RoutineController.createRoutine);
router.get("/", RoutineController.getAllRoutines);
router.get("/coach/:coachId", RoutineController.getRoutinesByCoach);
router.get("/client/:clientId", RoutineController.getRoutinesByClient);

export { router };

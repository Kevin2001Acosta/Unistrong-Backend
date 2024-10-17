import { Router, Request, Response } from "express";
import RoutineController from "../controllers/routines.controller";

const router = Router();

router.post("/create", RoutineController.createRoutine);
router.post("/assing", RoutineController.assignRoutineToClient);
router.get("/", RoutineController.getAllRoutines);

export { router };

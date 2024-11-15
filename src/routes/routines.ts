import { Router, Request, Response } from "express";
import RoutineController from "../controllers/routines.controller";

const router = Router();

router.post("/create", RoutineController.createRoutine);
router.post("/assing", RoutineController.assignRoutineToClient);
router.get("/", RoutineController.getAllRoutines);
router.post("/assignByEmail", RoutineController.assignRoutineByEmail);
router.get("/client/:clientId", RoutineController.getClientRoutines);

export { router };

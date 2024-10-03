import { Router, Request, Response } from "express";
import RoutineService from "../services/routines/routines.services";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const routine = await RoutineService.createRoutine(req.body);
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const routines = await RoutineService.getAllRoutines();
    res.status(200).json(routines);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Obtener rutinas por ID de coach
router.get("/coach/:coachId", async (req: Request, res: Response) => {
  try {
    const routines = await RoutineService.getRoutinesByCoach(
      parseInt(req.params.coachId)
    );
    res.status(200).json(routines);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Obtener rutinas por ID de cliente
router.get("/client/:clientId", async (req: Request, res: Response) => {
  try {
    const routines = await RoutineService.getRoutinesByClient(
      parseInt(req.params.clientId)
    );
    res.status(200).json(routines);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export { router };

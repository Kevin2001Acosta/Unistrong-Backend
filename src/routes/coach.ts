import { Router, Request, Response } from "express";
import CoachService from "../services/coach/coach.services";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const coach = await CoachService.createCoach(req.body);
    res.status(201).json(coach);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const coaches = await CoachService.getAllCoach();
    res.status(200).json(coaches);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/:id/clients", async (req: Request, res: Response) => {
  const coachId = parseInt(req.params.id);

  if (isNaN(coachId)) {
    return res.status(400).json({ message: "ID de coach inválido" });
  }

  try {
    const coachWithClients = await CoachService.getClientsByCoachId(coachId);
    res.status(200).json(coachWithClients);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export { router };

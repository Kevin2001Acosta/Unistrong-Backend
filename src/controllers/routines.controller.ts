import { Request, Response, NextFunction } from "express";
import RoutineService from "../services/routines/routines.services";
import createError from "http-errors";

class RoutineController {
  async createRoutine(req: Request, res: Response, next: NextFunction) {
    try {
      const routine = await RoutineService.createRoutine(req.body);
      res.status(201).json(routine);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
  async getAllRoutines(req: Request, res: Response, next: NextFunction) {
    try {
      const routines = await RoutineService.getAllRoutines();
      res.status(200).json(routines);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getRoutinesByCoach(req: Request, res: Response, next: NextFunction) {
    try {
      const coachId = parseInt(req.params.coachId);
      if (isNaN(coachId)) {
        throw new Error("ID de coach inválido");
      }
      const routines = await RoutineService.getRoutinesByCoach(coachId);
      res.status(200).json(routines);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getRoutinesByClient(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = parseInt(req.params.clientId);
      if (isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }
      const routines = await RoutineService.getRoutinesByClient(clientId);
      res.status(200).json(routines);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new RoutineController();

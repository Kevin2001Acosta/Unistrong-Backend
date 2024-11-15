import { Request, Response, NextFunction } from "express";
import RoutineService from "../services/routines/routines.services";
import createError from "http-errors";

class RoutineController {
  // Crear una rutina y asignarla a un cliente
  async createRoutine(req: Request, res: Response, next: NextFunction) {
    try {
      const routine = await RoutineService.createRoutine(req.body);
      res.status(201).json(routine);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Obtener todas las rutinas
  async getAllRoutines(req: Request, res: Response, next: NextFunction) {
    try {
      const routines = await RoutineService.getAllRoutines();
      res.status(200).json(routines);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Asignar una rutina existente a un cliente existente en la tabla cliente
  async assignRoutineToClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId, routineId, scheduledDate } = req.body;

      // Validar los IDs
      if (!clientId || isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }
      if (!routineId || isNaN(routineId)) {
        throw new Error("ID de rutina inválido");
      }
      if (!scheduledDate) {
        throw new Error("Fecha programada inválida");
      }

      // Asignar la rutina al cliente con la fecha programada
      await RoutineService.assignRoutineToClient({
        clientId,
        routineId,
        scheduledDate,
      });
      res.status(200).json({ message: "Rutina asignada correctamente" });
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async assignRoutineByEmail(req: Request, res: Response, next: NextFunction) {
    const { email, routineName, scheduledDate } = req.body;
    try {
      if (!email || !routineName || !scheduledDate) {
        return next(
          createError(
            400,
            "Todos los campos son obligatorios: email, routineName, scheduledDate."
          )
        );
      }
      await RoutineService.assignRoutineByEmail(
        email,
        routineName,
        scheduledDate
      );
      res.status(200).json({ message: "Rutina asignada correctamente" });
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getClientRoutines(req: Request, res: Response, next: NextFunction) {
    const { clientId } = req.params;
    try {
      const routines = await RoutineService.getRoutinesByClientId(
        Number(clientId)
      );
      return res.status(200).json(routines);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}
export default new RoutineController();

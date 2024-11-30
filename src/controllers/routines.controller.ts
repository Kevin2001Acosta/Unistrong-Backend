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

  //Anterior

  // async assignRoutineByEmail(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { email, routineId, scheduledDate, recurrenceDay } = req.body;

  //   try {
  //     // Validar campos obligatorios
  //     if (
  //       !email ||
  //       !routineId ||
  //       !scheduledDate ||
  //       recurrenceDay === undefined
  //     ) {
  //       return next(
  //         createError(
  //           400,
  //           "Los campos obligatorios son: email, routineId, scheduledDate y recurrenceDay."
  //         )
  //       );
  //     }

  //     // Validar que `recurrenceDay` sea un valor válido (0-6)
  //     if (recurrenceDay < 0 || recurrenceDay > 6) {
  //       return next(
  //         createError(400, "El día de recurrencia debe estar entre 0 y 6.")
  //       );
  //     }

  //     // Conversión de `scheduledDate` a un objeto de tipo `Date`
  //     const parsedScheduledDate = new Date(scheduledDate);
  //     if (isNaN(parsedScheduledDate.getTime())) {
  //       return next(createError(400, "La fecha proporcionada no es válida."));
  //     }

  //     // Llamar al servicio para asignar la rutina
  //     const { recurrentDates } = await RoutineService.assignRoutineByEmail(
  //       email,
  //       routineId,
  //       parsedScheduledDate,
  //       recurrenceDay
  //     );

  //     res.status(200).json({
  //       message: "Rutina asignada correctamente.",
  //       recurrentDates,
  //     });
  //   } catch (error) {
  //     next(createError(400, (error as Error).message));
  //   }
  // }

  async assignRoutineByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, routineId, scheduledDate, recurrenceDay } = req.body;

    try {
      // Validar campos obligatorios
      if (
        !email ||
        !routineId ||
        !scheduledDate ||
        recurrenceDay === undefined
      ) {
        return next(
          createError(
            400,
            "Los campos obligatorios son: email, routineId, scheduledDate y recurrenceDay."
          )
        );
      }

      // Validar que `recurrenceDay` sea un valor válido (0-6)
      if (recurrenceDay < 0 || recurrenceDay > 6) {
        return next(
          createError(400, "El día de recurrencia debe estar entre 0 y 6.")
        );
      }

      // Conversión de `scheduledDate` a un objeto de tipo `Date`
      const parsedScheduledDate = new Date(scheduledDate);
      if (isNaN(parsedScheduledDate.getTime())) {
        return next(createError(400, "La fecha proporcionada no es válida."));
      }

      // Llamar al servicio para asignar la rutina
      const { recurrentDates } = await RoutineService.assignRoutineByEmail(
        email,
        routineId,
        parsedScheduledDate,
        recurrenceDay
      );

      res.status(200).json({
        message: "Rutina asignada correctamente.",
        recurrentDates,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      next(createError(500, errorMessage));
    }
  }

  //actual
  // async getClientRoutines(req: Request, res: Response, next: NextFunction) {
  //   const { clientId } = req.params;

  //   try {
  //     // Validar que el clientId sea un número válido
  //     if (!clientId || isNaN(Number(clientId))) {
  //       return next(
  //         createError(400, "El ID del cliente debe ser un número válido.")
  //       );
  //     }

  //     // Llamar al servicio para obtener las rutinas del cliente
  //     const routines = await RoutineService.getRoutinesByClientId(
  //       Number(clientId)
  //     );

  //     // Responder con las rutinas obtenidas
  //     return res.status(200).json(routines);
  //   } catch (error) {
  //     // Manejo de errores centralizado
  //     next(
  //       createError(
  //         500,
  //         `Error al obtener las rutinas del cliente: ${
  //           (error as Error).message
  //         }`
  //       )
  //     );
  //   }
  // }

  async getClientRoutines(req: Request, res: Response, next: NextFunction) {
    const { clientId } = req.params;

    try {
      // Validar que el clientId sea un número válido
      if (!clientId || isNaN(Number(clientId))) {
        return next(
          createError(400, "El ID del cliente debe ser un número válido.")
        );
      }

      // Llamar al servicio para obtener las rutinas del cliente
      const routines = await RoutineService.getRoutinesByClientId(
        Number(clientId)
      );

      // Si no se encontraron rutinas, responder con un mensaje adecuado
      if (!routines || (Array.isArray(routines) && routines.length === 0)) {
        return res.status(404).json({
          message: "Este cliente no tiene rutinas asignadas.",
        });
      }

      // Responder con las rutinas obtenidas
      return res.status(200).json(routines);
    } catch (error) {
      next(
        createError(
          500,
          `Error al obtener las rutinas del cliente: ${
            (error as Error).message
          }`
        )
      );
    }
  }

  async getCoachRoutines(req: Request, res: Response, next: NextFunction) {
    const { coachId } = req.params;

    try {
      const coach = await RoutineService.getRoutinesByCoachId(Number(coachId));

      if (!coach || !coach.routines || coach.routines.length === 0) {
        return res
          .status(404)
          .json({ message: "No se encontraron rutinas para este coach." });
      }

      return res.status(200).json(coach.routines);
    } catch (error) {
      next(
        createError(
          400,
          `Error al obtener rutinas: ${(error as Error).message}`
        )
      );
    }
  }
}
export default new RoutineController();

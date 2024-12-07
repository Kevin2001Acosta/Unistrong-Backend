import { Request, Response, NextFunction } from "express";
import DietsServices from "../services/diets/diets.services";
import createError from "http-errors";

class DietController {
  // Crear una dieta y asignarla a un cliente
  async createDiet(req: Request, res: Response, next: NextFunction) {
    try {
      const diet = await DietsServices.createDiet(req.body);
      res.status(201).json(diet);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Obtener todas las dietas
  async getAllDiets(req: Request, res: Response, next: NextFunction) {
    try {
      const diets = await DietsServices.getAllDiets();
      res.status(200).json(diets);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Asignar una dieta existente a un cliente
  async assignDietToClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId, dietId } = req.body;

      // Validar los IDs
      if (!clientId || isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }
      if (!dietId || isNaN(dietId)) {
        throw new Error("ID de dieta inválido");
      }

      // Asignar la rutina al cliente
      await DietsServices.assignDietToClient({ clientId, dietId });
      res.status(200).json({ message: "Dieta asignada correctamente" });
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async assignDietByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, dietId } = req.body;

      // Validar los datos de entrada
      if (!email) {
        throw new Error("El email es obligatorio.");
      }
      if (!dietId || isNaN(dietId)) {
        throw new Error("ID de dieta inválido.");
      }

      // Llamar al servicio para asignar la dieta
      await DietsServices.assignDietByEmail(email, Number(dietId));

      res
        .status(200)
        .json({ message: "Dieta asignada correctamente al cliente." });
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getDietsByNutritionist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        throw new Error("ID de nutriólogo inválido.");
      }

      const diets = await DietsServices.getDietsByNutritionist(Number(id));
      res.status(200).json(diets);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getDietsByClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // Obtener el clientId de los parámetros de la URL
      const diets = await DietsServices.getDietsByClient(Number(id)); // Llamar al servicio

      res.status(200).json(diets); // Devolver las dietas al cliente
    } catch (error) {
      next(createError(400, (error as Error).message)); // Manejar errores
    }
  }
}
export default new DietController();

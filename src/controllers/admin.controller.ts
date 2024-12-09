import { Request, Response, NextFunction } from "express";
import adminServices from "../services/admin/admin.services";
import createError from "http-errors";
import AdminService from "../services/admin/admin.services";

class AdminController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminServices.createAdmin(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async createUserAnyType(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.createUserAnyType(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async assignCoachToClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientEmail, coachEmail } = req.body;

      // Validación de parámetros
      if (!clientEmail || !coachEmail) {
        throw new Error(
          "Se requiere el correo electrónico del cliente y del coach."
        );
      }

      const result = await AdminService.assignCoachToClient(
        clientEmail,
        coachEmail
      );
      res.status(200).json({ message: "Coach asignado correctamente", result });
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async assignNutriToClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientEmail, nutriEmail } = req.body;

      // Validación de parámetros
      if (!clientEmail || !nutriEmail) {
        throw new Error(
          "Se requiere el correo electrónico del cliente y del nutriologo."
        );
      }

      const result = await AdminService.assignNutritionistToClient(
        clientEmail,
        nutriEmail
      );
      res
        .status(200)
        .json({ message: "Nutriologo asignado correctamente", result });
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new AdminController();

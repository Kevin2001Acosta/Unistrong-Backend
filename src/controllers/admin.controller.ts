import { Request, Response, NextFunction } from "express";
import adminServices from "../services/admin/admin.services";
import NutritionistService from "../services/nutritionist/nutritionist.services";
import CoachService from "../services/coach/coach.services";
import ClientService from "../services/client/client.services";
import AuthService from "../services/user/auth.services";
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

  async getCoachInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error("No se proporcionó un token en el encabezado de autorización.");
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
          throw new Error("Formato del token inválido.");
      }

      const tokenBearer = parts[1];
      const token = await AuthService.verifyToken(tokenBearer);

      const isAdmin = await adminServices.AdminExist(token.id);

      if (isAdmin) {
        const coaches = await CoachService.getAllCoach();
        res.status(201).json(coaches);
      }
      else{
        throw createError(401, "El usuario no es un admin, no está habilitado para esta función.");
      }
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getNutriInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error("No se proporcionó un token en el encabezado de autorización.");
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
          throw new Error("Formato del token inválido.");
      }

      const tokenBearer = parts[1];
      const token = await AuthService.verifyToken(tokenBearer);

      const isAdmin = await adminServices.AdminExist(token.id);

      if (isAdmin) {
        const nutritionists = await NutritionistService.getAllNutritionist();
        res.status(200).json(nutritionists);
      }
      else{
        throw createError(401, "El usuario no es un admin, no está habilitado para esta función.");
      }
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getClientInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error("No se proporcionó un token en el encabezado de autorización.");
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
          throw new Error("Formato del token inválido.");
      }

      const tokenBearer = parts[1];
      const token = await AuthService.verifyToken(tokenBearer);

      const isAdmin = await adminServices.AdminExist(token.id);

      if (isAdmin) {
        const clients = await ClientService.getAllClient();
        res.status(200).json(clients);
      }
      else{
        throw createError(401, "El usuario no es un admin, no está habilitado para esta función.");
      }
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new AdminController();

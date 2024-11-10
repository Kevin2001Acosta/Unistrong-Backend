import { Request, Response, NextFunction } from "express";
import UserService from "../services/user/user.services";
import createError from "http-errors";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validación si el ID no es un número
      if (isNaN(Number(id))) {
        return next(createError(400, "El ID debe ser un número válido"));
      }

      const user = await UserService.getUserById(Number(id));
      if (!user) {
        throw createError(404, "Usuario no encontrado");
      }
      res.status(200).json(user);
    } catch (error) {
      if ((error as Error).message === "Usuario no encontrado") {
        return next(createError(404, "Usuario no encontrado"));
      }
      // Si es cualquier otro error, lo tratamos como un error 400
      next(createError(400, (error as Error).message));
    }
  }
}

export default new UserController();

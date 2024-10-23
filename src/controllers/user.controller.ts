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

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Si el middleware verifyToken pasa, el token es válido
      res
        .status(200)
        .json({ message: "Token válido", userId: req.body.userId });
    } catch (error) {
      // Si ocurre algún error en la lógica, manejamos la excepción
      next(createError(400, "Hubo un problema al verificar el token"));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(Number(id));
      if (!user) {
        throw createError(404, "Usuario no encontrado");
      }
      res.status(200).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new UserController();

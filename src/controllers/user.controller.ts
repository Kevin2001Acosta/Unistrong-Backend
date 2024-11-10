import { Request, Response, NextFunction } from "express";
import UserService from "../services/user/user.services";
import createError from "http-errors";
import AuthService from "../services/user/auth.services";
import userServices from "../services/user/user.services";

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
      const user = await UserService.getUserById(Number(id));
      if (!user) {
        throw createError(404, "Usuario no encontrado");
      }
      res.status(200).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async disableAccount(req: Request, res: Response, next: NextFunction) {
    try {
      
      const { token } = req.params;
      const { password } = req.body;

      const tokenUser = await AuthService.verifyToken(token);
      const user = await UserService.getUserById(Number(tokenUser.id));

      if (!user) {
        throw createError(401, "Usuario no encontrado");
      }

      const bdPassword = await UserService.getpasswordById(tokenUser.id);
      const isCorrectPassword = await AuthService.comparePasswords(password, bdPassword);

      if(!isCorrectPassword) {
        throw createError(401, "Contraseña incorrecta");
      }

      await userServices.disableAccount(tokenUser.id);
      
      res.status(200).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }

  }
}

export default new UserController();

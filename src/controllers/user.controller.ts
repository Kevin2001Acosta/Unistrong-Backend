import { Request, Response, NextFunction } from "express";
import UserService from "../services/user/user.services";
import createError from "http-errors";
import AuthService from "../services/user/auth.services";
import bcrypt from "bcrypt";  // Usamos bcrypt para encriptar las contraseñas

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

      if (!isCorrectPassword) {
        throw createError(401, "Contraseña incorrecta");
      }

      await UserService.disableAccount(tokenUser.id);

      res.status(200).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Método para actualizar el nombre de usuario
  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, phoneNumber, password } = req.body;

      const updateData: { name?: string; phoneNumber?: string; password?: string } = {};

      if (name) updateData.name = name;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (password) updateData.password = password;

      const updatedUser = await UserService.updateUserProfile(Number(id), updateData);

      res.status(200).json(updatedUser);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Método para cambiar la contraseña de un usuario
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Validar que la nueva contraseña cumpla con los requisitos de seguridad
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        throw createError(400, "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      }

      // Obtener los datos del usuario
      const user = await UserService.getUserById(Number(id));
      if (!user) {
        throw createError(404, "Usuario no encontrado");
      }

      // Verificar si la contraseña actual es correcta
      const isPasswordValid = await AuthService.comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        throw createError(401, "Contraseña actual incorrecta");
      }

      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña en la base de datos
      const updatedUser = await UserService.updateUserProfile(Number(id), { password: hashedPassword });

      res.status(200).json(updatedUser);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new UserController();

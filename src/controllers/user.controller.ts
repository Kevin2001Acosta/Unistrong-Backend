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

  // Método para actualizar el nombre de usuario
  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;  // Obtenemos el ID desde los parámetros
      const { name, phoneNumber, password } = req.body;  // Obtenemos los nuevos campos desde el cuerpo de la solicitud
  
      // Creamos un objeto con los campos que están presentes en la solicitud
      const updateData: { name?: string; phoneNumber?: string; password?: string } = {};
  
      if (name) updateData.name = name;  // Si se proporciona un nombre, lo agregamos al objeto
      if (phoneNumber) updateData.phoneNumber = phoneNumber;  // Si se proporciona un teléfono, lo agregamos
      if (password) updateData.password = password;  // Si se proporciona una contraseña, la agregamos
  
      // Llamamos al servicio para actualizar los campos proporcionados
      const updatedUser = await UserService.updateUserProfile(Number(id), updateData);
  
      // Retornamos la respuesta con el usuario actualizado
      res.status(200).json(updatedUser);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }


  async updateUserMeasurements(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;  // Obtenemos el ID desde los parámetros
      const { weight, waist, legs, arms, chest, glutes} = req.body;  // Obtenemos los nuevos campos desde el cuerpo de la solicitud
  
      // Creamos un objeto con los campos que están presentes en la solicitud
      const updateData: { weight?: number; height?:number; waist?: number; legs?: number, arms?: number,
        chest?:number, glutes?: number} = {};
  
      if (weight) updateData.weight = weight; 
      if (waist) updateData.waist = waist;  
      if (legs) updateData.legs = legs;  
      if (arms) updateData.arms = arms;  
      if (chest) updateData.chest = chest;  
      if (glutes) updateData.glutes = glutes;  
  
      // Llamamos al servicio para actualizar los campos proporcionados
      const updatedUserMeasurements = await UserService.updateUserMeasurements(Number(id), updateData);
  
      // Retornamos la respuesta con el usuario actualizado
      res.status(200).json(updatedUserMeasurements);
      
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
  
}

export default new UserController();

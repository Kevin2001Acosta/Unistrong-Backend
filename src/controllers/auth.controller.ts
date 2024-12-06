import { Request, Response, NextFunction } from "express";
import AuthService from "../services/user/auth.services";
import Users from "../db/models/user.model";
import createError from "http-errors";
import UserService from "../services/user/user.services";
import { UserType } from "../db/models/utils/user.types";
import Coach from "../db/models/coach.models";
import Client from "../db/models/client.models";
import Nutritionist from "../db/models/nutritionist.model";

class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      // Buscar el usuario por su correo electrónico
      const user = await Users.findOne({ where: { email } });

      // Validar si el usuario existe
      if (!user) {
        throw createError(401, "Credenciales incorrectas");
      }

      // Verificar la contraseña
      const isPasswordValid = await AuthService.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw createError(401, "Credenciales incorrectas");
      }

      // Generar el token JWT
      const token = AuthService.generateToken(user.id);

      let additionalData = null;

      // Validar el tipo de usuario y obtener datos adicionales
      if (user.userType === UserType.COACH) {
        additionalData = await Coach.findOne({ where: { user_id: user.id } });
      }

      if (user.userType === UserType.CLIENT) {
        additionalData = await Client.findOne({ where: { user_id: user.id } });
      }

      if (user.userType === UserType.NUTRITIONIST) {
        additionalData = await Nutritionist.findOne({
          where: { user_id: user.id },
        });
      }

      // Configurar la cookie con el token
      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
      });

      // Devolver el token y datos del usuario
      return res.status(200).json({
        message: "Usuario logeado exitosamente",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          state: user.state,
          userType: user.userType,
          additionalData,
        },
      });
    } catch (error) {
      console.log("Error en el login:", error);
      //manejo de errores
      if (error instanceof createError.HttpError) {
        return res.status(error.status).json({
          status: error.status,
          message: error.message,
        });
      }

      return res.status(500).json({
        status: 500,
        message: "Error interno del servidor",
      });
    }
  }
  async logout(req: Request, res: Response): Promise<Response> {
    try {
      res.clearCookie("token");
      return res
        .status(200)
        .json({ message: "Usuario deslogeado exitosamente" });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Buscar el usuario usando el userId extraído del token
      const user = await UserService.getUserById(req.body.userId);

      // Si el usuario no existe, retornamos un error
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Si el token es válido, devolver la información del usuario
      return res.status(200).json({
        message: "Token válido",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          state: user.state,
          userType: user.userType,
        },
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: "Hubo un problema al verificar el token",
      });
    }
  }
}

export default new AuthController();

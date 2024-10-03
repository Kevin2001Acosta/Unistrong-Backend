import { Request, Response } from "express";
import AuthService from "../user/auth.services";
import Users from "../../db/models/user.model";
import createError from "http-errors";

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

      // Devolver el token y datos del usuario
      return res.status(200).json({
        message: "Usuario logeado exitosamente",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error en el login:", error);
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
}

export default new AuthController();

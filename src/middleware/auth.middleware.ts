import { Request, Response, NextFunction } from "express";
import AuthService from "../services/user/auth.services";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Captura el token de los encabezados

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    // Verifica el token
    const decoded = AuthService.verifyToken(token);
    req.body.userId = decoded.id; // Agrega el ID del usuario a la solicitud
    next(); // Pasa al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

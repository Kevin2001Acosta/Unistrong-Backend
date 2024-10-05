import { Request, Response, NextFunction } from "express";
import AuthService from "../services/user/auth.services";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extraer el token desde la cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

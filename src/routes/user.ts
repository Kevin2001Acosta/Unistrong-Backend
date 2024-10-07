//endpoints
import { Router, Request, Response } from "express";
import UserService from "../services/user/user.services";
import AuthController from "../services/utils/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = Router();

router.post("/login", AuthController.login);

router.post("/register", async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/verify", verifyToken, (req: Request, res: Response) => {
  try {
    // Si el middleware verifyToken pasa, el token es válido
    res.status(200).json({ message: "Token válido", userId: req.body.userId });
  } catch (error) {
    // Si ocurre algún error en la lógica, manejamos la excepción
    return res.status(400).json({
      status: 400,
      message: "Hubo un problema al verificar el token",
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(Number(id));
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});
export { router };

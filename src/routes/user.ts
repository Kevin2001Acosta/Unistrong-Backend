//endpoints
import { Router, Request, Response } from "express";
import UserService from "../services/user/user.services";
import AuthController from "../services/utils/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = Router();

router.post("/login", AuthController.login);

// router.post("/logout", (req: Request, res: Response) => {
//   try {
//     res.clearCookie("token", {
//       httpOnly: false,
//       secure: false,
//     });
//     // Enviar respuesta exitosa
//     res.status(200).json({ message: "Logout exitoso" });
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       message: "Error al cerrar sesión",
//     });
//   }
// });

router.post("/register", async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/verify", verifyToken, async (req: Request, res: Response) => {
  try {
    // Buscar el usuario usando el userId extraído del token
    const user = await UserService.getUserById(req.body.userId);

    // Si el usuario no existe, retornamos un error
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si el middleware verifyToken pasa, el token es válido y se devuelve la información del usuario
    res.status(200).json({
      message: "Token válido",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        state: user.state,
      },
    });
  } catch (error) {
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

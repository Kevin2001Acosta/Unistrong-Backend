//endpoints
import { Router, Request, Response } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import userController from "../controllers/user.controller";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logout", verifyToken, AuthController.logout);
router.get("/verify", verifyToken, AuthController.verifyToken);
router.post("/register", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

// router.get("/verify", verifyToken, async (req: Request, res: Response) => {
//   try {
//     // Buscar el usuario usando el userId extraído del token
//     const user = await UserService.getUserById(req.body.userId);

//     // Si el usuario no existe, retornamos un error
//     if (!user) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }

//     // Si el middleware verifyToken pasa, el token es válido y se devuelve la información del usuario
//     res.status(200).json({
//       message: "Token válido",
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         state: user.state,
//       },
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: 400,
//       message: "Hubo un problema al verificar el token",
//     });
//   }
// });

export { router };

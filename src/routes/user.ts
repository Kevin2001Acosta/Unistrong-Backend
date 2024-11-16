//endpoints
import { Router, Request, Response } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import userController from "../controllers/user.controller";
import loginBestWayController from "../controllers/loginBestWay.controller";

const router = Router();

router.post("/login", AuthController.login);//primero
//router.post("/login", loginBestWayController.login);//segundo mejor forma
router.post("/logout", verifyToken, AuthController.logout);
router.get("/verify", verifyToken, AuthController.verifyToken);
router.post("/register", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/disable-account/:token", userController.disableAccount);
router.patch("/editar_perfil/:id", userController.updateUserProfile);


export { router };

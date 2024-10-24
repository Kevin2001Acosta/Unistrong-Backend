//endpoints
import { Router, Request, Response } from "express";
import UserController from "../controllers/user.controller";
import AuthController from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", UserController.createUser);
router.post("/login", AuthController.login);
router.get("/verify", verifyToken, AuthController.validateToken);
router.post("/logout", verifyToken, AuthController.logout);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);

export { router };

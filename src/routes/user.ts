//endpoints
import { Router, Request, Response } from "express";
import UserController from "../controllers/user.controller";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);

export { router };

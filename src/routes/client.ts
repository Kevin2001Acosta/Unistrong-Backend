//endpoints
import { Router, Request, Response } from "express";
import ClientController from "../controllers/client.controller";

const router = Router();

router.post("/register", ClientController.createClient);
router.get("/", ClientController.getAllClients);
router.get("/:id", ClientController.getClientById);
router.get("/:id/user", ClientController.getUserByClientId);

export { router };

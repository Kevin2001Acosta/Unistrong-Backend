// endpoints/clientRoutes.ts
import { Router, Request, Response } from "express";
import ClientController from "../controllers/client.controller";

const router = Router();

// Ruta para registrar un nuevo cliente
router.post("/register", ClientController.createClient);

// Ruta para obtener todos los clientes
router.get("/", ClientController.getAllClients);

// Ruta para obtener un cliente por ID
router.get("/:id", ClientController.getClientById);

// Ruta para obtener el usuario asociado a un cliente (por ID de cliente)
router.get("/:id/user", ClientController.getUserByClientId);

// Ruta para actualizar parcialmente los datos de un cliente (editar perfil)
router.patch("/editar_perfil_client/:id", ClientController.updateClient);

export { router };

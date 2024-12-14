//endpoints
import { Router } from "express";
import ClientController from "../controllers/client.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = Router();
router.post("/register", verifyToken, ClientController.createClient);
router.get("/", ClientController.getAllClients);
router.get("/:id", ClientController.getClientById);
router.get("/:id/user", ClientController.getUserByClientId);
// Nueva ruta para actualizar parcialmente un cliente
router.patch("/editar_perfil_client/:id", ClientController.updateClient);
router.put("/update_membership", verifyToken, ClientController.updateClientMembership);
router.get("/client-coach/:id", ClientController.getClientWithCoachAndUser);
router.put("/fill_client_fields", verifyToken, ClientController.fillClientFields);
export { router };

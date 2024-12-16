"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//endpoints
const express_1 = require("express");
const client_controller_1 = __importDefault(require("../controllers/client.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const pdf_controller_1 = __importDefault(require("../controllers/pdf.controller"));
const router = (0, express_1.Router)();
exports.router = router;
router.post("/register", auth_middleware_1.verifyToken, client_controller_1.default.createClient);
router.get("/", client_controller_1.default.getAllClients);
router.get("/:id", client_controller_1.default.getClientById);
router.get("/:id/user", client_controller_1.default.getUserByClientId);
// Nueva ruta para actualizar parcialmente un cliente
router.put("/edit_perfil_client", auth_middleware_1.verifyToken, client_controller_1.default.updateClient);
router.put("/update_membership", auth_middleware_1.verifyToken, client_controller_1.default.updateClientMembership);
router.get("/client-coach/:id", client_controller_1.default.getClientWithCoachAndUser);
router.put("/fill_client_fields", auth_middleware_1.verifyToken, client_controller_1.default.fillClientFields);
router.get("/get-pdf-characteristics/:userId", pdf_controller_1.default.generateStatisticsPDF);
router.get("/ByUser/:id", client_controller_1.default.getClientByUserId);
// Nuevo endpoint para generar y enviar el PDF por correo
router.post("/send-pdf/:userId", auth_middleware_1.verifyToken, pdf_controller_1.default.generateAndSendPDF);

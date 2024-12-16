"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_services_1 = __importDefault(require("../services/client/client.services"));
const http_errors_1 = __importDefault(require("http-errors"));
class ClientController {
    createClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.user_id = req.body.userId;
                const client = yield client_services_1.default.createClient(req.body);
                res.status(201).json(client);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    fillClientFields(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.user_id = req.body.userId;
                const client = yield client_services_1.default.fillClientFields(req.body);
                res.status(200).json({
                    message: "Campos de cliente actualizados",
                    client,
                });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getAllClients(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield client_services_1.default.getAllClient();
                res.status(200).json(clients);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getClientById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = parseInt(req.params.id);
                if (isNaN(clientId)) {
                    throw new Error("ID de cliente inválido");
                }
                const client = yield client_services_1.default.getClientById(clientId);
                res.status(200).json(client);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getUserByClientId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = parseInt(req.params.id);
                if (isNaN(clientId)) {
                    throw new Error("ID de cliente inválido");
                }
                const user = yield client_services_1.default.getUserByClientId(clientId);
                res.status(200).json(user);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    // Nuevo método para actualizar campos parciales del cliente
    updateClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedClient = yield client_services_1.default.updateClient(req.body);
                res.status(200).json(updatedClient);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    updateClientMembership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, idMembership } = req.body;
                if (isNaN(userId) || isNaN(idMembership)) {
                    throw new Error(`ID de usuario: ${userId} o membresía inválido: ${idMembership}`);
                }
                const updatedClient = yield client_services_1.default.updateClientMembership(userId, idMembership);
                res.status(200).json(updatedClient);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getClientWithCoachAndUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientId = parseInt(req.params.id); // Obtener el ID del cliente desde los parámetros de la ruta
                if (isNaN(clientId)) {
                    throw new Error("ID de cliente inválido");
                }
                // Llamada al servicio para obtener el cliente, coach y usuario asociados
                const client = yield client_services_1.default.getClientWithCoachAndUser(clientId);
                res.status(200).json(client);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getClientByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id); // Obtener el ID del usuario desde los parámetros de la ruta
                if (isNaN(userId)) {
                    throw new Error("ID de usuario inválido");
                }
                // Llamada al servicio para obtener el cliente asociado al usuario
                const client = yield client_services_1.default.getClientByUserId(userId);
                res.status(200).json(client);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
}
exports.default = new ClientController();

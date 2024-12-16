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
const admin_services_1 = __importDefault(require("../services/admin/admin.services"));
const nutritionist_services_1 = __importDefault(require("../services/nutritionist/nutritionist.services"));
const coach_services_1 = __importDefault(require("../services/coach/coach.services"));
const client_services_1 = __importDefault(require("../services/client/client.services"));
const auth_services_1 = __importDefault(require("../services/user/auth.services"));
const http_errors_1 = __importDefault(require("http-errors"));
const admin_services_2 = __importDefault(require("../services/admin/admin.services"));
class AdminController {
    createAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield admin_services_1.default.createAdmin(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    createUserAnyType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield admin_services_2.default.createUserAnyType(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    assignCoachToClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientEmail, coachEmail } = req.body;
                // Validación de parámetros
                if (!clientEmail || !coachEmail) {
                    throw new Error("Se requiere el correo electrónico del cliente y del coach.");
                }
                const result = yield admin_services_2.default.assignCoachToClient(clientEmail, coachEmail);
                res.status(200).json({ message: "Coach asignado correctamente", result });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    assignNutriToClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientEmail, nutriEmail } = req.body;
                // Validación de parámetros
                if (!clientEmail || !nutriEmail) {
                    throw new Error("Se requiere el correo electrónico del cliente y del nutriologo.");
                }
                const result = yield admin_services_2.default.assignNutritionistToClient(clientEmail, nutriEmail);
                res
                    .status(200)
                    .json({ message: "Nutriologo asignado correctamente", result });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getCoachInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    throw new Error("No se proporcionó un token en el encabezado de autorización.");
                }
                const parts = authHeader.split(" ");
                if (parts.length !== 2 || parts[0] !== "Bearer") {
                    throw new Error("Formato del token inválido.");
                }
                const tokenBearer = parts[1];
                const token = yield auth_services_1.default.verifyToken(tokenBearer);
                const isAdmin = yield admin_services_1.default.AdminExist(token.id);
                if (isAdmin) {
                    const coaches = yield coach_services_1.default.getAllCoach();
                    res.status(201).json(coaches);
                }
                else {
                    throw (0, http_errors_1.default)(401, "El usuario no es un admin, no está habilitado para esta función.");
                }
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getNutriInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    throw new Error("No se proporcionó un token en el encabezado de autorización.");
                }
                const parts = authHeader.split(" ");
                if (parts.length !== 2 || parts[0] !== "Bearer") {
                    throw new Error("Formato del token inválido.");
                }
                const tokenBearer = parts[1];
                const token = yield auth_services_1.default.verifyToken(tokenBearer);
                const isAdmin = yield admin_services_1.default.AdminExist(token.id);
                if (isAdmin) {
                    const nutritionists = yield nutritionist_services_1.default.getAllNutritionist();
                    res.status(200).json(nutritionists);
                }
                else {
                    throw (0, http_errors_1.default)(401, "El usuario no es un admin, no está habilitado para esta función.");
                }
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getClientInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    throw new Error("No se proporcionó un token en el encabezado de autorización.");
                }
                const parts = authHeader.split(" ");
                if (parts.length !== 2 || parts[0] !== "Bearer") {
                    throw new Error("Formato del token inválido.");
                }
                const tokenBearer = parts[1];
                const token = yield auth_services_1.default.verifyToken(tokenBearer);
                const isAdmin = yield admin_services_1.default.AdminExist(token.id);
                if (isAdmin) {
                    const clients = yield client_services_1.default.getAllClient();
                    res.status(200).json(clients);
                }
                else {
                    throw (0, http_errors_1.default)(401, "El usuario no es un admin, no está habilitado para esta función.");
                }
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    deactivateUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emails } = req.body;
                // Validar que se envíen correos electrónicos
                if (!emails || !Array.isArray(emails) || emails.length === 0) {
                    throw new Error("Se debe proporcionar un array de correos electrónicos.");
                }
                // Llamar al servicio para desactivar los usuarios
                yield admin_services_2.default.deactivateUsers(emails);
                // Responder con éxito
                res.status(200).json({ message: "Usuarios desactivados correctamente." });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    updateUsersState(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emails } = req.body;
                // Validar que se envíe un array de actualizaciones
                if (!Array.isArray(emails) || emails.length === 0) {
                    throw new Error("Se debe proporcionar un array de emails.");
                }
                // Validar el formato de cada actualización
                for (const { email, state } of emails) {
                    if (typeof email !== "string" || typeof state !== "boolean") {
                        throw new Error("Cada elemento del array debe incluir un email y un estado booleano.");
                    }
                }
                // Llamar al servicio para actualizar el estado de los usuarios
                yield admin_services_2.default.updateUsersState(emails);
                // Responder con éxito
                res.status(200).json({
                    message: "El estado de los usuarios se actualizó correctamente.",
                });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message)); // Se mantiene el manejo de errores
            }
        });
    }
}
exports.default = new AdminController();

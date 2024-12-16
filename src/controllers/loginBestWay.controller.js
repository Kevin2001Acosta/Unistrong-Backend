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
const auth_services_1 = __importDefault(require("../services/user/auth.services"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
const user_types_1 = require("../db/models/utils/user.types");
const coach_models_1 = __importDefault(require("../db/models/coach.models"));
const client_models_1 = __importDefault(require("../db/models/client.models"));
const client_services_1 = __importDefault(require("../services/client/client.services"));
class LoginBestWayController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Buscar el usuario por su correo electrónico, seleccionando solo los campos necesarios
                const user = yield user_model_1.default.findOne({
                    where: { email },
                    attributes: [
                        "id",
                        "username",
                        "password",
                        "email",
                        "state",
                        "userType",
                    ],
                });
                // Validar si el usuario existe y evitar la consulta redundante a la BD
                if (!user) {
                    // Error específico para credenciales incorrectas
                    return res.status(401).json({
                        status: 401,
                        message: "Credenciales incorrectas",
                    });
                }
                // Comparar las contraseñas
                try {
                    const isMatch = yield auth_services_1.default.comparePasswords(password, user.password);
                    if (!isMatch) {
                        return res.status(401).json({
                            status: 401,
                            message: "Credenciales incorrectas",
                        });
                    }
                }
                catch (error) {
                    return res.status(401).json({
                        status: 401,
                        message: "Credenciales incorrectas",
                    });
                }
                let additionalData = null;
                if (user.userType === user_types_1.UserType.COACH) {
                    additionalData = yield coach_models_1.default.findOne({ where: { user_id: user.id } });
                }
                if (user.userType === user_types_1.UserType.CLIENT) {
                    additionalData = yield client_models_1.default.findOne({ where: { user_id: user.id } });
                }
                // buscar si los campos están llenos, si están vacíos enviar false
                const clientexist = yield client_services_1.default.getfilledFilledByUserId(user.id);
                // Generar el token
                const token = auth_services_1.default.generateToken(user.id);
                // Configurar la cookie con el token
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
                // Responder con los datos del usuario y el token
                return res.status(200).json({
                    message: "Usuario logeado exitosamente",
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        state: user.state,
                        userType: user.userType,
                        additionalData,
                    },
                    infoClientRegistered: clientexist,
                });
            }
            catch (error) {
                // Log de error para ver qué está pasando
                console.error("Error en el login:", error);
                // Si el error es un problema inesperado, devolver un 500
                return res.status(500).json({
                    status: 500,
                    message: (error instanceof Error ? error.message : "Error desconocido") ||
                        "Error interno del servidor",
                });
            }
        });
    }
}
exports.default = new LoginBestWayController();

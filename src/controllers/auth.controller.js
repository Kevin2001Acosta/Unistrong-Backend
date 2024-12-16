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
const http_errors_1 = __importDefault(require("http-errors"));
const user_services_1 = __importDefault(require("../services/user/user.services"));
const user_types_1 = require("../db/models/utils/user.types");
const coach_models_1 = __importDefault(require("../db/models/coach.models"));
const client_models_1 = __importDefault(require("../db/models/client.models"));
const verification_services_1 = __importDefault(require("../services/verification/verification.services"));
const client_services_1 = __importDefault(require("../services/client/client.services"));
const nutritionist_model_1 = __importDefault(require("../db/models/nutritionist.model"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Buscar el usuario por su correo electrónico
                const user = yield user_model_1.default.findOne({ where: { email } });
                // Validar si el usuario existe
                if (!user) {
                    throw (0, http_errors_1.default)(401, "Credenciales incorrectas");
                }
                // Verificar la contraseña
                const isPasswordValid = yield auth_services_1.default.comparePasswords(password, user.password);
                if (!isPasswordValid) {
                    throw (0, http_errors_1.default)(401, "Credenciales incorrectas");
                }
                // Generar el token JWT
                const token = auth_services_1.default.generateToken(user.id);
                const stateUser = user.state;
                if (!stateUser) {
                    throw (0, http_errors_1.default)(403, "La cuenta ha sido desactivada");
                }
                let additionalData = null;
                // Validar el tipo de usuario y obtener datos adicionales
                if (user.userType === user_types_1.UserType.COACH) {
                    additionalData = yield coach_models_1.default.findOne({ where: { user_id: user.id } });
                }
                if (user.userType === user_types_1.UserType.CLIENT) {
                    additionalData = yield client_models_1.default.findOne({ where: { user_id: user.id } });
                }
                if (user.userType === user_types_1.UserType.NUTRITIONIST) {
                    additionalData = yield nutritionist_model_1.default.findOne({
                        where: { user_id: user.id },
                    });
                }
                // Configurar la cookie con el token
                res.cookie("token", token, {
                    httpOnly: false,
                    secure: false,
                });
                const clientexist = yield client_services_1.default.getfilledFilledByUserId(user.id); // si hay algúno de los campos llenos, envíe true si ningúno está lleno false
                // Devolver el token y datos del usuario
                const isverified = yield verification_services_1.default.isClientVerified(user.id);
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
                        infoClienteVerified: isverified,
                    },
                    infoClientRegistered: clientexist,
                });
            }
            catch (error) {
                console.log("Error en el login:", error);
                //manejo de errores
                if (error instanceof http_errors_1.default.HttpError) {
                    return res.status(error.status).json({
                        status: error.status,
                        message: error.message,
                    });
                }
                return res.status(500).json({
                    status: 500,
                    message: "Error interno del servidor",
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("token");
                return res
                    .status(200)
                    .json({ message: "Usuario deslogeado exitosamente" });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar el usuario usando el userId extraído del token
                const user = yield user_services_1.default.getUserById(req.body.userId);
                // Si el usuario no existe, retornamos un error
                if (!user) {
                    return res.status(404).json({ message: "Usuario no encontrado" });
                }
                const isverified = yield verification_services_1.default.isClientVerified(user.id);
                // Si el token es válido, devolver la información del usuario
                return res.status(200).json({
                    message: "Token válido",
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        state: user.state,
                        userType: user.userType,
                        infoClienteVerified: isverified,
                    },
                });
            }
            catch (error) {
                return res.status(400).json({
                    status: 400,
                    message: "Hubo un problema al verificar el token",
                });
            }
        });
    }
}
exports.default = new AuthController();

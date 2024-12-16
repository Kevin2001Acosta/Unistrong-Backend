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
const user_services_1 = __importDefault(require("../services/user/user.services"));
const http_errors_1 = __importDefault(require("http-errors"));
const auth_services_1 = __importDefault(require("../services/user/auth.services"));
const user_services_2 = __importDefault(require("../services/user/user.services"));
class UserController {
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_services_1.default.createUser(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_services_1.default.getAllUsers();
                res.status(200).json(users);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Validación si el ID no es un número
                if (isNaN(Number(id))) {
                    return next((0, http_errors_1.default)(400, "El ID debe ser un número válido"));
                }
                const user = yield user_services_1.default.getUserById(Number(id));
                if (!user) {
                    throw (0, http_errors_1.default)(404, "Usuario no encontrado");
                }
                res.status(200).json(user);
            }
            catch (error) {
                if (error.message === "Usuario no encontrado") {
                    return next((0, http_errors_1.default)(404, "Usuario no encontrado"));
                }
                // Si es cualquier otro error, lo tratamos como un error 400
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    disableAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const { password } = req.body;
                const tokenUser = yield auth_services_1.default.verifyToken(token);
                const user = yield user_services_1.default.getUserById(Number(tokenUser.id));
                if (!user) {
                    throw (0, http_errors_1.default)(401, "Usuario no encontrado");
                }
                const bdPassword = yield user_services_1.default.getpasswordById(tokenUser.id);
                const isCorrectPassword = yield auth_services_1.default.comparePasswords(password, bdPassword);
                if (!isCorrectPassword) {
                    throw (0, http_errors_1.default)(401, "Contraseña incorrecta");
                }
                yield user_services_2.default.disableAccount(tokenUser.id);
                res.status(200).json(user);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    // Método para actualizar el nombre de usuario
    updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Obtenemos el ID desde los parámetros
                const { name, phoneNumber, password } = req.body; // Obtenemos los nuevos campos desde el cuerpo de la solicitud
                // Creamos un objeto con los campos que están presentes en la solicitud
                const updateData = {};
                if (name)
                    updateData.name = name; // Si se proporciona un nombre, lo agregamos al objeto
                if (phoneNumber)
                    updateData.phoneNumber = phoneNumber; // Si se proporciona un teléfono, lo agregamos
                if (password)
                    updateData.password = password; // Si se proporciona una contraseña, la agregamos
                // Llamamos al servicio para actualizar los campos proporcionados
                const updatedUser = yield user_services_1.default.updateUserProfile(Number(id), updateData);
                // Retornamos la respuesta con el usuario actualizado
                res.status(200).json(updatedUser);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    updateUserMeasurements(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Obtenemos el ID desde los parámetros
                const { weight, waist, legs, arms, chest, glutes } = req.body; // Obtenemos los nuevos campos desde el cuerpo de la solicitud
                // Creamos un objeto con los campos que están presentes en la solicitud
                const updateData = {};
                if (weight)
                    updateData.weight = weight;
                if (waist)
                    updateData.waist = waist;
                if (legs)
                    updateData.legs = legs;
                if (arms)
                    updateData.arms = arms;
                if (chest)
                    updateData.chest = chest;
                if (glutes)
                    updateData.glutes = glutes;
                // Llamamos al servicio para actualizar los campos proporcionados
                const updatedUserMeasurements = yield user_services_1.default.updateUserMeasurements(Number(id), updateData);
                // Retornamos la respuesta con el usuario actualizado
                res.status(200).json(updatedUserMeasurements);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
}
exports.default = new UserController();

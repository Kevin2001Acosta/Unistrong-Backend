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
const user_model_1 = __importDefault(require("../../db/models/user.model"));
const auth_services_1 = __importDefault(require("././auth.services"));
const http_errors_1 = __importDefault(require("http-errors"));
const sequelize_1 = require("sequelize");
const constraints_1 = require("../../db/models/utils/constraints");
const client_models_1 = __importDefault(require("../../db/models/client.models"));
const user_types_1 = require("../../db/models/utils/user.types");
const coach_models_1 = __importDefault(require("../../db/models/coach.models"));
const nutritionist_model_1 = __importDefault(require("../../db/models/nutritionist.model"));
const client_characteristics_models_1 = __importDefault(require("../../db/models/client.characteristics.models"));
class UserService {
    updateUser(user) {
        throw new Error("Method not implemented.");
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                console.log("usuario:", userData);
                // Validaciones de contraseña y nombre de usuario
                (0, constraints_1.isStrongPassword)(userData.password);
                (0, constraints_1.isValidUsername)(userData.username);
                // Hashear la contraseña
                const hashedPassword = yield auth_services_1.default.hashPassword(userData.password);
                // Crear el usuario
                const user = yield user_model_1.default.create(Object.assign(Object.assign({}, userData), { password: hashedPassword, state: true }));
                //Crear tambien en la tabla cliente si es un cliente
                if (user.userType === user_types_1.UserType.CLIENT) {
                    yield client_models_1.default.create({
                        user_id: user.id,
                    });
                    console.log("cliente creado");
                }
                //Crear tambien en la tabla nutriologo si es un nutriologo
                if (user.userType === user_types_1.UserType.NUTRITIONIST) {
                    yield nutritionist_model_1.default.create({
                        user_id: user.id,
                    });
                    console.log("nutriologo creado");
                }
                //Crear tambien en la tabla coach si es un coach
                if (user.userType === user_types_1.UserType.COACH) {
                    yield coach_models_1.default.create({
                        user_id: user.id,
                    });
                    console.log("coach creado");
                }
                return user;
            }
            catch (error) {
                // Manejo específico de errores de unicidad
                if (error instanceof sequelize_1.UniqueConstraintError) {
                    if (((_a = error.parent) === null || _a === void 0 ? void 0 : _a.constraint) === "users_email_key") {
                        throw (0, http_errors_1.default)(409, "El correo electrónico ya está registrado.");
                    }
                    if (((_b = error.parent) === null || _b === void 0 ? void 0 : _b.constraint) === "users_username_key") {
                        throw (0, http_errors_1.default)(409, "El nombre de usuario ya está en uso.");
                    }
                    if (((_c = error.parent) === null || _c === void 0 ? void 0 : _c.constraint) === "users_dni_key") {
                        throw (0, http_errors_1.default)(409, "El DNI ya está registrado.");
                    }
                    throw (0, http_errors_1.default)(409, "Ya existe un registro con este dato.");
                }
                throw (0, http_errors_1.default)(400, `Error al crear el usuario: ${error.message}`);
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.findAll();
                return users.length > 0 ? users : [];
            }
            catch (error) {
                throw new Error(`Error al obtener usuarios: ${error.message}`);
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByPk(id);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                return user;
            }
            catch (error) {
                throw new Error(`Error al obtener el usuario: ${error.message}`);
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ where: { email } });
                return user;
            }
            catch (error) {
                throw new Error(`Error al obtener el usuario: ${error.message}`);
            }
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserByEmail(email);
            if (!user) {
                throw new Error("El email no está registrado");
            }
            (0, constraints_1.isStrongPassword)(password);
            const hashedPassword = yield auth_services_1.default.hashPassword(password);
            yield user_model_1.default.update({ password: hashedPassword }, { where: { id: user.id } });
        });
    }
    disableAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(id);
            if (!user) {
                throw new Error("El email no está registrado");
            }
            yield user_model_1.default.update({ state: false }, { where: { id: user.id } });
        });
    }
    getpasswordById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({
                    where: { id },
                    attributes: ["password"],
                });
                return user ? user.password : "";
            }
            catch (error) {
                throw new Error(`Error al obtener la contraseña: ${error.message}`);
            }
        });
    }
    // Método para actualizar el nombre del usuario
    updateUserProfile(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificamos si el usuario existe en la base de datos
                const user = yield user_model_1.default.findByPk(id); // findByPk devuelve una instancia de Sequelize o null
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                // Actualizamos solo los campos presentes en updateData
                if (updateData.name)
                    user.name = updateData.name;
                if (updateData.phoneNumber)
                    user.phoneNumber = updateData.phoneNumber;
                if (updateData.password) {
                    user.password = yield auth_services_1.default.hashPassword(updateData.password); // Si se proporciona contraseña, la hasheamos
                }
                yield user.save(); // Guardamos los cambios, ya que 'user' es una instancia de Sequelize
                return user; // Retornamos el usuario actualizado
            }
            catch (error) {
                throw new Error(`Error al actualizar el perfil: ${error.message}`);
            }
        });
    }
    updateUserMeasurements(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificamos si el usuario existe en la base de datos
                const user = yield user_model_1.default.findByPk(id); // findByPk devuelve una instancia de Sequelize o null
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                // findByPk devuelve una instancia de Sequelize o null
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                const cliente = yield client_models_1.default.findOne({
                    where: {
                        user_id: id,
                    }
                });
                if (!cliente) {
                    throw new Error("Cliente no encontrado");
                }
                const validData = {};
                if (cliente.id)
                    validData.id = cliente.id;
                if (updateData.weight)
                    validData.weight = updateData.weight;
                if (updateData.height)
                    validData.height = updateData.height;
                if (updateData.waist)
                    validData.waist = updateData.waist;
                if (updateData.legs)
                    validData.legs = updateData.legs;
                if (updateData.arms)
                    validData.arms = updateData.arms;
                if (updateData.chest)
                    validData.chest = updateData.chest;
                if (updateData.glutes)
                    validData.glutes = updateData.glutes;
                if (Object.keys(validData).length === 0) {
                    throw new Error("No se proporcionaron datos válidos para actualizar");
                }
                const characteristicsData = {
                    clientId: cliente.id,
                    weight: validData.weight,
                    height: validData.height,
                    waist: validData.waist,
                    legs: validData.legs,
                    arms: validData.arms,
                    chest: validData.chest,
                    glutes: validData.glutes,
                };
                Object.keys(characteristicsData).forEach((key) => characteristicsData[key] === undefined && delete characteristicsData[key]);
                const characteristics = yield client_characteristics_models_1.default.create(characteristicsData);
                return characteristics;
            }
            catch (error) {
                throw new Error(`Error al actualizar el perfil: ${error.message}`);
            }
        });
    }
}
exports.default = new UserService();

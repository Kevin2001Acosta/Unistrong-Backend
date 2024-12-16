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
const admin_models_1 = __importDefault(require("../../db/models/admin.models"));
const client_models_1 = __importDefault(require("../../db/models/client.models"));
const coach_models_1 = __importDefault(require("../../db/models/coach.models"));
const nutritionist_model_1 = __importDefault(require("../../db/models/nutritionist.model"));
const user_model_1 = __importDefault(require("../../db/models/user.model"));
const constraints_1 = require("../../db/models/utils/constraints");
const user_types_1 = require("../../db/models/utils/user.types");
const sequelize_1 = require("sequelize");
const http_errors_1 = __importDefault(require("http-errors"));
const auth_services_1 = __importDefault(require("../../services/user/auth.services"));
class AdminService {
    createAdmin(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ where: { email: adminData.email } });
            if (!user) {
                throw new Error("El usuario con el email proporcionado no existe.");
            }
            const existingAdmin = yield admin_models_1.default.findOne({ where: { user_id: user.id } });
            if (existingAdmin) {
                throw new Error("El usuario ya está registrado como administrador.");
            }
            user.userType = user_types_1.UserType.ADMIN;
            yield user.save();
            const newAdmin = yield admin_models_1.default.create({ user_id: user.id });
            return newAdmin;
        });
    }
    createUserAnyType(userData) {
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
                const user = yield user_model_1.default.create(Object.assign(Object.assign({}, userData), { state: true, password: hashedPassword }));
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
    assignCoachToClient(clientEmail, coachEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            //Buscar al cliente por email
            const clientUser = yield user_model_1.default.findOne({
                where: { email: clientEmail, userType: user_types_1.UserType.CLIENT },
            });
            if (!clientUser) {
                throw (0, http_errors_1.default)(404, "El cliente no existe o no tiene el tipo CLIENT.");
            }
            //Verificar si el cliente ya tiene un coach asignado
            const client = yield client_models_1.default.findOne({ where: { user_id: clientUser.id } });
            if (!client) {
                throw (0, http_errors_1.default)(404, "El cliente no tiene un perfil en la tabla Clients.");
            }
            if (client.coach_id) {
                throw (0, http_errors_1.default)(400, "El cliente ya tiene un coach asignado.");
            }
            //Buscar al coach por email
            const coachUser = yield user_model_1.default.findOne({
                where: { email: coachEmail, userType: user_types_1.UserType.COACH },
            });
            if (!coachUser) {
                throw (0, http_errors_1.default)(404, "El coach no existe o no tiene el tipo COACH.");
            }
            //Verificar si el coach está registrado en la tabla Coaches
            const coach = yield coach_models_1.default.findOne({ where: { user_id: coachUser.id } });
            if (!coach) {
                throw (0, http_errors_1.default)(404, "El coach no tiene un perfil en la tabla Coaches.");
            }
            //Asignar el coach al cliente
            client.coach_id = coach.id;
            yield client.save();
        });
    }
    assignNutritionistToClient(clientEmail, nutriEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            //Buscar al cliente por email
            const clientUser = yield user_model_1.default.findOne({
                where: { email: clientEmail, userType: user_types_1.UserType.CLIENT },
            });
            if (!clientUser) {
                throw (0, http_errors_1.default)(404, "El cliente no existe o no tiene el tipo CLIENT.");
            }
            //Verificar si el cliente ya tiene un coach asignado
            const client = yield client_models_1.default.findOne({ where: { user_id: clientUser.id } });
            if (!client) {
                throw (0, http_errors_1.default)(404, "El cliente no tiene un perfil en la tabla Clients.");
            }
            if (client.nutritionist_id) {
                throw (0, http_errors_1.default)(400, "El cliente ya tiene un nutriologo asignado.");
            }
            //Buscar al coach por email
            const nutri = yield user_model_1.default.findOne({
                where: { email: nutriEmail, userType: user_types_1.UserType.NUTRITIONIST },
            });
            if (!nutri) {
                throw (0, http_errors_1.default)(404, "El coach no existe.");
            }
            //Verificar si el coach está registrado en la tabla Coaches
            const nutriExist = yield nutritionist_model_1.default.findOne({
                where: { user_id: nutri.id },
            });
            if (!nutriExist) {
                throw (0, http_errors_1.default)(404, "El coach no tiene un perfil.");
            }
            //Asignar el nutriologo al cliente
            client.nutritionist_id = nutriExist.id;
            yield client.save();
        });
    }
    AdminExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield admin_models_1.default.findOne({
                    where: {
                        user_id: id,
                    },
                    attributes: ["user_id"],
                });
                if (!admin) {
                    throw new Error("El administrador no existe");
                }
                return true;
            }
            catch (error) {
                throw new Error(`Error al obtener el administrador: ${error.message}`);
            }
        });
    }
    deactivateUsers(emails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si la lista de correos no está vacía
                if (!emails || emails.length === 0) {
                    throw (0, http_errors_1.default)(400, "Debe proporcionar al menos un email.");
                }
                // Buscar usuarios por sus correos electrónicos
                const users = yield user_model_1.default.findAll({
                    where: {
                        email: emails,
                    },
                });
                // Validar si todos los correos proporcionados corresponden a usuarios existentes
                const foundEmails = users.map((user) => user.email);
                const notFoundEmails = emails.filter((email) => !foundEmails.includes(email));
                if (notFoundEmails.length > 0) {
                    throw (0, http_errors_1.default)(404, `No se encontraron los siguientes usuarios: ${notFoundEmails.join(", ")}.`);
                }
                // Desactivar los usuarios encontrados
                yield user_model_1.default.update({ state: false }, // Actualizar el estado a `false`
                {
                    where: {
                        email: emails,
                    },
                });
            }
            catch (error) {
                throw (0, http_errors_1.default)(400, `Error al desactivar usuarios: ${error.message}`);
            }
        });
    }
    updateUsersState(emails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const { email } of emails) {
                    // Buscar al usuario por email
                    const user = yield user_model_1.default.findOne({ where: { email } });
                    if (!user) {
                        throw new Error(`El usuario con el email ${email} no existe.`);
                    }
                    console.log(`Estado actual de ${email}: ${user.state}`); // Para depuración
                    // Cambiar el estado del usuario: si es 'false', cambiar a 'true' y viceversa
                    user.state = !user.state; // Invierte el estado
                    console.log(`Nuevo estado de ${email}: ${user.state}`); // Para depuración
                    // Guardar los cambios en la base de datos
                    yield user.save();
                }
            }
            catch (error) {
                throw new Error(`Error al actualizar el estado de los usuarios: ${error.message}`);
            }
        });
    }
}
exports.default = new AdminService();

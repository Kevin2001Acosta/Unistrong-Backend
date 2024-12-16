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
const client_models_1 = __importDefault(require("../../db/models/client.models"));
const user_model_1 = __importDefault(require("../../db/models/user.model"));
const user_types_1 = require("../../db/models/utils/user.types");
const coach_models_1 = __importDefault(require("../../db/models/coach.models"));
const nutritionist_model_1 = __importDefault(require("../../db/models/nutritionist.model"));
const routines_models_1 = __importDefault(require("../../db/models/routines.models"));
const diets_models_1 = __importDefault(require("../../db/models/diets.models"));
const membership_models_1 = __importDefault(require("../../db/models/membership.models"));
const constraints_1 = require("../../db/models/utils/constraints");
const auth_services_1 = __importDefault(require("../user/auth.services"));
class ClientService {
    createClient(clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si el usuario existe
                const user = yield user_model_1.default.findByPk(clientData.user_id);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                if (user.userType !== user_types_1.UserType.CLIENT) {
                    throw new Error("El usuario no es del tipo cliente");
                }
                // Verificar si el coach existe
                if (clientData.coach_id) {
                    const coach = yield coach_models_1.default.findByPk(clientData.coach_id);
                    if (!coach) {
                        throw new Error("El coach especificado no existe");
                    }
                }
                // Verificar si el nutriólogo existe
                if (clientData.nutritionist_id) {
                    const nutritionist = yield nutritionist_model_1.default.findByPk(clientData.nutritionist_id);
                    if (!nutritionist) {
                        throw new Error("El nutriólogo especificado no existe");
                    }
                }
                // verificar si el usuario ya tiene un cliente asociado
                const verifyClient = yield client_models_1.default.findOne({
                    where: { user_id: clientData.user_id },
                });
                if (verifyClient) {
                    throw new Error("El usuario ya tiene un cliente asociado,\nEntre al perfil y actualice su información");
                }
                // Crear el cliente
                const client = yield client_models_1.default.create({
                    user_id: clientData.user_id,
                    coach_id: clientData.coach_id,
                    nutritionist_id: clientData.nutritionist_id,
                    birthDate: clientData.birthDate,
                    height: clientData.height,
                    diseases: clientData.diseases || [],
                    dietaryRestrictions: clientData.dietaryRestrictions || [],
                    membershipId: clientData.membershipId,
                });
                return client;
            }
            catch (error) {
                throw new Error(`Error al crear cliente: ${error.message}`);
            }
        });
    }
    fillClientFields(clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar si el usuario existe
                const user = yield user_model_1.default.findByPk(clientData.user_id);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                if (user.userType !== user_types_1.UserType.CLIENT) {
                    throw new Error("El usuario no es del tipo cliente");
                }
                // verificar si el usuario ya tiene un cliente asociado
                const client = yield client_models_1.default.findOne({
                    where: { user_id: clientData.user_id },
                });
                if (!client) {
                    throw new Error("El usuario No tiene un cliente asociado");
                }
                // Llenar campos de cliente solo si están presentes en clientData
                if (clientData.birthDate !== undefined) {
                    client.birthDate = clientData.birthDate;
                }
                if (clientData.height !== undefined) {
                    client.height = clientData.height;
                }
                if (clientData.diseases !== undefined) {
                    client.diseases = clientData.diseases;
                }
                if (clientData.dietaryRestrictions !== undefined) {
                    client.dietaryRestrictions = clientData.dietaryRestrictions;
                }
                if (clientData.membershipId !== undefined) {
                    client.membershipId = clientData.membershipId;
                }
                yield client.save();
                return client;
            }
            catch (error) {
                throw new Error(`Error al llenar campos: ${error.message}`);
            }
        });
    }
    getAllClient() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield client_models_1.default.findAll({
                    attributes: ["id", "user_id"],
                    include: [
                        {
                            model: user_model_1.default,
                            as: "user",
                            attributes: ["id", "username", "email", "name", "dni", "phone_number", "state", "userType"],
                        },
                    ],
                });
                return client.length > 0 ? client : [];
            }
            catch (error) {
                throw new Error(`Error al obtener clientes: ${error.message}`);
            }
        });
    }
    //Obtener cliente por id junto con su usuario, rutinas y dietas
    getClientById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield client_models_1.default.findByPk(id, {
                    include: [
                        { model: user_model_1.default, as: "user", attributes: ["id", "name", "email"] },
                        {
                            model: coach_models_1.default,
                            as: "coach",
                            include: [
                                {
                                    model: user_model_1.default,
                                    as: "user",
                                    attributes: ["id", "name", "email"],
                                },
                            ],
                        },
                        { model: routines_models_1.default, as: "routines", attributes: ["id", "name"] },
                        { model: diets_models_1.default, as: "diets", attributes: ["id", "name"] },
                        { model: membership_models_1.default, as: "Membership", attributes: ["id", "price"] },
                    ],
                });
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                return client;
            }
            catch (error) {
                throw new Error(`Error al obtener el cliente: ${error.message}`);
            }
        });
    }
    getUserByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield client_models_1.default.findByPk(clientId, {
                    include: [{ model: user_model_1.default, as: "user" }],
                });
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                return client.user || null;
            }
            catch (error) {
                throw new Error(`Error al obtener el usuario del cliente: ${error.message}`);
            }
        });
    }
    // Nuevo método para actualizar parcialmente los datos del cliente
    updateClient(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByPk(updateData.userId);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                if (user.userType !== user_types_1.UserType.CLIENT) {
                    throw new Error("El usuario no es del tipo cliente");
                }
                const client = yield client_models_1.default.findOne({ where: { user_id: updateData.userId } });
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                let count = 0;
                const passExist = !!updateData.passwordCurrent;
                if (passExist) { // si existe la contraseña actual
                    if (updateData.password) { // si existe la contraseña nueva
                        (0, constraints_1.isStrongPassword)(updateData.password); // validar requisitos de la contraseña nueva
                        const pass = yield auth_services_1.default.comparePasswords(updateData.passwordCurrent, user.password); //comparar la contraseña actual con la almacenada
                        if (!pass) { // si no pasa. contraseña incorrecta
                            throw new Error("Contraseña actual incorrecta");
                        }
                        let hashedPassword;
                        hashedPassword = yield auth_services_1.default.hashPassword(updateData.password);
                        user.password = hashedPassword;
                        count++;
                    }
                }
                user.name = updateData.name || user.name;
                user.email = updateData.email || user.email;
                user.dni = updateData.dni || user.dni;
                user.phoneNumber = updateData.phoneNumber || user.phoneNumber;
                client.birthDate = updateData.birthDate || client.birthDate;
                client.height = updateData.height || client.height;
                client.diseases = updateData.diseases || client.diseases;
                client.dietaryRestrictions = updateData.dietaryRestrictions || client.dietaryRestrictions;
                yield user.save();
                yield client.save();
                const message = count > 0 ? "Todos los datos actualizados" : "Datos actualizados, menos la contraseña";
                return { user, client, message };
                // Actualización parcial
            }
            catch (error) {
                throw new Error(`Error al actualizar el cliente: ${error.message}`);
            }
        });
    }
    updateClientMembership(userId, idMembership) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // verificar si el usuario es tipo cliente
                const user = yield user_model_1.default.findByPk(userId);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                if (user.userType !== user_types_1.UserType.CLIENT) {
                    throw new Error("El usuario no es del tipo cliente");
                }
                // busco el cliente
                const client = yield client_models_1.default.findOne({ where: { user_id: userId } });
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                //verifico que no sea la misma membresía
                if (client.membershipId === idMembership) {
                    return client;
                }
                // verifico la membresía
                const membership = yield membership_models_1.default.findByPk(idMembership);
                if (!membership) {
                    throw new Error("Membresía no encontrada");
                }
                // actualizo la membresía o la creo si no está
                client.membershipId = idMembership;
                yield client.save();
                return client;
            }
            catch (error) {
                throw new Error(`Error al actualizar membresía: ${error.message}`);
            }
        });
    }
    getfilledFilledByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield client_models_1.default.findOne({ where: { user_id: userId } });
                if (client &&
                    (client.birthDate === null || client.birthDate === undefined) &&
                    (client.height === null || client.height === undefined) &&
                    (client.diseases === null || client.diseases.length === 0) &&
                    (client.dietaryRestrictions === null || client.dietaryRestrictions.length === 0) &&
                    (client.membershipId === null || client.membershipId === undefined)) {
                    return false; // los campos están vacíos
                }
                ;
                return true; // Algún campo fué llenado
            }
            catch (error) {
                throw new Error(`Error al obtener el cliente por id de usuario: ${error.message}`);
            }
        });
    }
    getClientByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield client_models_1.default.findOne({
                    where: { user_id: userId },
                    include: [
                        {
                            model: membership_models_1.default,
                            as: "membership",
                            attributes: ["id", "price"],
                        },
                        {
                            model: user_model_1.default,
                            as: "user",
                            attributes: ["id", "name", "email", "dni", "phoneNumber"],
                        }
                    ],
                });
                return client; // Retorna el cliente o null si no existe
            }
            catch (error) {
                throw new Error(`Error al obtener el cliente por id de usuario: ${error.message}`);
            }
        });
    }
    getClientWithCoachAndUser(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield client_models_1.default.findOne({
                where: { id: clientId },
                include: [
                    {
                        model: coach_models_1.default,
                        as: "coach", // Esto accede al coach asociado con el cliente
                        include: [
                            {
                                model: user_model_1.default, // Aquí se accede al 'user' asociado al coach
                                as: "user",
                                attributes: ["id", "name", "email"],
                            },
                        ],
                    },
                ],
            });
            if (!client) {
                throw new Error("Client not found");
            }
            return client;
        });
    }
}
exports.default = new ClientService();
;

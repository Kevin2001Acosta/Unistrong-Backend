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
const nutritionist_model_1 = __importDefault(require("../../db/models/nutritionist.model"));
const diets_models_1 = __importDefault(require("../../db/models/diets.models"));
const client_diets_models_1 = __importDefault(require("../../db/models/client_diets.models"));
const user_model_1 = __importDefault(require("../../db/models/user.model"));
const user_types_1 = require("../../db/models/utils/user.types");
class DietsService {
    createDiet(dietData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nutri = yield nutritionist_model_1.default.findByPk(dietData.nutritionistId);
                if (!nutri) {
                    throw new Error("Nutriologo no encontrado");
                }
                const diet = yield diets_models_1.default.create(dietData);
                return diet;
            }
            catch (error) {
                throw new Error(`Error al crear la dieta: ${error.message}`);
            }
        });
    }
    getAllDiets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const diets = yield diets_models_1.default.findAll({
                    include: [
                        {
                            model: client_models_1.default,
                            as: "clients",
                            attributes: ["id", "user_id"],
                            include: [
                                {
                                    model: user_model_1.default,
                                    as: "user",
                                    attributes: ["id", "name"],
                                },
                            ],
                        },
                    ],
                });
                return diets.length > 0 ? diets : [];
            }
            catch (error) {
                throw new Error(`Error al obtener las dietas: ${error.message}`);
            }
        });
    }
    assignDietToClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clientId, dietId } = data;
            try {
                // Verificar si el cliente y la dieta existen
                const clientExists = yield client_models_1.default.findByPk(clientId);
                if (!clientExists) {
                    throw new Error("El cliente especificado no existe.");
                }
                const dietExists = yield diets_models_1.default.findByPk(dietId);
                if (!dietExists) {
                    throw new Error("La rutina especificada no existe.");
                }
                // Asignar la dieta al cliente en la tabla intermedia
                yield client_diets_models_1.default.create({ clientId, dietId });
            }
            catch (error) {
                throw new Error(`Error al asignar la dieta: ${error.message}`);
            }
        });
    }
    assignDietByEmail(email, dietId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar el usuario por email
                const user = yield user_model_1.default.findOne({ where: { email } });
                if (!user) {
                    throw new Error("Usuario no encontrado.");
                }
                if (user.userType !== user_types_1.UserType.CLIENT) {
                    throw new Error("El usuario especificado no es un cliente.");
                }
                // Buscar el cliente asociado al usuario
                const client = yield client_models_1.default.findOne({ where: { user_id: user.id } });
                if (!client) {
                    throw new Error("Cliente no encontrado.");
                }
                // Verificar si la dieta existe
                const diet = yield diets_models_1.default.findByPk(dietId);
                if (!diet) {
                    throw new Error("Dieta no encontrada.");
                }
                yield client_diets_models_1.default.create({ clientId: client.id, dietId });
                client.nutritionist_id = diet.nutritionistId;
                yield client.save();
            }
            catch (error) {
                throw new Error(`Error al asignar la rutina: ${error.message}`);
            }
        });
    }
    // async getDietsByNutritionist(nutritionistId: number): Promise<Diets[]> {
    //   if (!nutritionistId || isNaN(nutritionistId)) {
    //     throw new Error("ID de nutriólogo inválido.");
    //   }
    //   const diets = await Diets.findAll({
    //     where: { nutritionistId },
    //   });
    //   if (diets.length === 0) {
    //     throw new Error("No se encontraron dietas para este nutriólogo.");
    //   }
    //   return diets;
    // }
    getDietsByNutritionist(nutritionistId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nutri = yield nutritionist_model_1.default.findByPk(nutritionistId, {
                    include: [
                        {
                            model: diets_models_1.default,
                            as: "diets",
                            attributes: ["id", "name", "description", "type"],
                            include: [
                                {
                                    model: client_models_1.default,
                                    as: "clients",
                                    attributes: ["id", "user_id"],
                                    include: [
                                        {
                                            model: user_model_1.default,
                                            as: "user",
                                            attributes: ["id", "name"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
                if (!nutri) {
                    throw new Error("Nutriologo no encontrado.");
                }
                return nutri;
            }
            catch (error) {
                throw new Error(`Error al obtener dietas: ${error.message}`);
            }
        });
    }
    getDietsByClient(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!clientId || isNaN(clientId)) {
                throw new Error("ID de cliente inválido.");
            }
            // Buscar todas las dietas asociadas al cliente en la tabla intermedia ClientDiets
            const clientDiets = yield client_diets_models_1.default.findAll({
                where: { clientId },
                include: [
                    {
                        model: diets_models_1.default,
                        as: "diet", // Alias 'diet' definido en la relación
                        attributes: ["id", "name", "description", "type"], // Solo traer los atributos necesarios
                    },
                ],
            });
            if (clientDiets.length === 0) {
                throw new Error("No se encontraron dietas asignadas para este cliente.");
            }
            // Extraer las dietas desde la relación con ClientDiets
            return clientDiets.map((clientDiet) => clientDiet.diet); // Aquí accedemos a la propiedad 'diet'
        });
    }
}
exports.default = new DietsService();

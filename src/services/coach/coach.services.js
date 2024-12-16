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
const coach_models_1 = __importDefault(require("../../db/models/coach.models"));
const client_models_1 = __importDefault(require("../../db/models/client.models"));
const user_model_1 = __importDefault(require("../../db/models/user.model"));
const user_types_1 = require("../../db/models/utils/user.types");
class CoachService {
    createCoach(coachData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByPk(coachData.user_id);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                user.userType = user_types_1.UserType.COACH;
                yield user.save();
                const coach = yield coach_models_1.default.create({ user_id: coachData.user_id });
                return coach;
            }
            catch (error) {
                throw new Error(`Error al crear coach: ${error.message}`);
            }
        });
    }
    //Obtener todos los coaches con su informacion de usuario
    getAllCoach() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coaches = yield coach_models_1.default.findAll({
                    attributes: ["id", "user_id"],
                    include: [
                        {
                            model: user_model_1.default,
                            as: "user",
                            attributes: [
                                "username",
                                "email",
                                "name",
                                "dni",
                                "phone_number",
                                "state",
                            ],
                        },
                    ],
                });
                return coaches.length > 0 ? coaches : [];
            }
            catch (error) {
                throw new Error(`Error al obtener todos los coaches: ${error.message}`);
            }
        });
    }
    getClientsByCoachId(coachId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coachWithClients = yield coach_models_1.default.findByPk(coachId, {
                    include: [
                        { model: client_models_1.default, as: "clients", attributes: ["id", "user_id"] },
                    ],
                });
                if (!coachWithClients) {
                    throw new Error("Coach no encontrado");
                }
                return coachWithClients;
            }
            catch (error) {
                throw new Error(`Error al obtener clientes del coach: ${error.message}`);
            }
        });
    }
    getCoachById(coachId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coach = yield coach_models_1.default.findByPk(coachId, {
                    include: [
                        {
                            model: user_model_1.default,
                            as: "user",
                        },
                    ],
                });
                if (!coach) {
                    throw new Error("Coach no encontrado");
                }
                return coach;
            }
            catch (error) {
                throw new Error(`Error al obtener coach por ID: ${error.message}`);
            }
        });
    }
    getCoachByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coach = yield coach_models_1.default.findOne({
                    where: {
                        user_id: userId,
                    },
                });
                return coach;
            }
            catch (error) {
                throw new Error(`Error al obtener el coach: ${error.message}`);
            }
        });
    }
}
exports.default = new CoachService();

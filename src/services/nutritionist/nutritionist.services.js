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
const nutritionist_model_1 = __importDefault(require("../../db/models/nutritionist.model"));
const user_model_1 = __importDefault(require("../../db/models/user.model"));
const user_types_1 = require("../../db/models/utils/user.types");
class NutritionistService {
    createNutritionist(nutritionistData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findByPk(nutritionistData.user_id);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                user.userType = user_types_1.UserType.NUTRITIONIST;
                yield user.save();
                const nutri = yield nutritionist_model_1.default.create({
                    user_id: nutritionistData.user_id,
                });
                return nutri;
            }
            catch (error) {
                throw new Error(`Error al crear nutriologo: ${error.message}`);
            }
        });
    }
    getAllNutritionist() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nutri = yield nutritionist_model_1.default.findAll({
                    attributes: ["id", "user_id"],
                    include: [
                        {
                            model: user_model_1.default,
                            as: "user",
                            attributes: ["username", "email", "name", "dni", "phone_number", "state"],
                        },
                    ],
                });
                return nutri.length > 0 ? nutri : [];
            }
            catch (error) {
                throw new Error(`Error al obtener todos los nutriologos: ${error.message}`);
            }
        });
    }
}
exports.default = new NutritionistService();

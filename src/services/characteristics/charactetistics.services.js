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
const client_characteristics_models_1 = __importDefault(require("../../db/models/client.characteristics.models"));
const client_models_1 = __importDefault(require("../../db/models/client.models"));
class CharacteristicsServices {
    // Crear características
    createCharacteristics(characteristicsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield client_models_1.default.findByPk(characteristicsData.clientId);
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                // Crear las características
                const characteristics = yield client_characteristics_models_1.default.create({
                    clientId: characteristicsData.clientId,
                    weight: characteristicsData.weight,
                    height: characteristicsData.height,
                    waist: characteristicsData.waist,
                    legs: characteristicsData.legs,
                    arms: characteristicsData.arms,
                    chest: characteristicsData.chest,
                    glutes: characteristicsData.glutes,
                });
                if (!characteristics) {
                    return null;
                }
                return characteristics;
            }
            catch (error) {
                throw new Error(`Error al crear las características: ${error.message}`);
            }
        });
    }
    getCharacteristics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const characteristics = yield client_characteristics_models_1.default.findAll();
                if (characteristics.length === 0) {
                    throw new Error("No se encontraron características");
                }
                return characteristics;
            }
            catch (error) {
                throw new Error(`Error al obtener las características: ${error.message}`);
            }
        });
    }
    getCharacteristicsByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const characteristics = yield client_characteristics_models_1.default.findOne({
                    where: { clientId },
                    include: [{ model: client_models_1.default, as: "client" }],
                });
                if (!characteristics) {
                    throw new Error("Características no encontradas para este cliente");
                }
                return characteristics;
            }
            catch (error) {
                throw new Error(`Error al obtener las características: ${error.message}`);
            }
        });
    }
}
exports.default = new CharacteristicsServices();

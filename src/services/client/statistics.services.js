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
const sequelize_1 = require("sequelize");
class StatisticsService {
    getMonthlyAverages(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_characteristics_models_1.default.findAll({
                where: { clientId },
                attributes: [
                    [(0, sequelize_1.fn)("TO_CHAR", (0, sequelize_1.col)("createdAt"), "YYYY-MM"), "month"],
                    [(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("weight")), "averageWeight"],
                    [(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("arms")), "averageArms"],
                    [(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("legs")), "averageLegs"],
                ],
                group: [(0, sequelize_1.col)("month")],
                order: [(0, sequelize_1.literal)("month")],
            });
            return result.map((row) => ({
                month: row.get("month"),
                averageWeight: parseFloat(row.get("averageWeight")),
                averageArms: parseFloat(row.get("averageArms")),
                averageLegs: parseFloat(row.get("averageLegs")),
            }));
        });
    }
}
exports.default = new StatisticsService();

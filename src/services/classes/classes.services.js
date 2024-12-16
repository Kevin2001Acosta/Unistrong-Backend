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
const classes_models_1 = __importDefault(require("../../db/models/classes.models"));
const coach_models_1 = __importDefault(require("../../db/models/coach.models"));
class ClassesService {
    createClass(classData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coach = yield coach_models_1.default.findByPk(classData.coachId);
                if (!coach) {
                    throw new Error("Coach no encontrado");
                }
                const classes = yield classes_models_1.default.create(classData);
                return classes;
            }
            catch (error) {
                throw new Error(`Error al crear la clase: ${error.message}`);
            }
        });
    }
    getAllClasses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classes = yield classes_models_1.default.findAll({
                    include: [
                        {
                            model: coach_models_1.default,
                            as: "coach",
                        },
                    ],
                });
                return classes.length > 0 ? classes : [];
            }
            catch (error) {
                throw new Error(`Error al obtener las clases: ${error.message}`);
            }
        });
    }
}
exports.default = new ClassesService();

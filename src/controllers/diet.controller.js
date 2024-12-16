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
const diets_services_1 = __importDefault(require("../services/diets/diets.services"));
const http_errors_1 = __importDefault(require("http-errors"));
class DietController {
    // Crear una dieta y asignarla a un cliente
    createDiet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const diet = yield diets_services_1.default.createDiet(req.body);
                res.status(201).json(diet);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    // Obtener todas las dietas
    getAllDiets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const diets = yield diets_services_1.default.getAllDiets();
                res.status(200).json(diets);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    // Asignar una dieta existente a un cliente
    assignDietToClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clientId, dietId } = req.body;
                // Validar los IDs
                if (!clientId || isNaN(clientId)) {
                    throw new Error("ID de cliente inválido");
                }
                if (!dietId || isNaN(dietId)) {
                    throw new Error("ID de dieta inválido");
                }
                // Asignar la rutina al cliente
                yield diets_services_1.default.assignDietToClient({ clientId, dietId });
                res.status(200).json({ message: "Dieta asignada correctamente" });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    assignDietByEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, dietId } = req.body;
                // Validar los datos de entrada
                if (!email) {
                    throw new Error("El email es obligatorio.");
                }
                if (!dietId || isNaN(dietId)) {
                    throw new Error("ID de dieta inválido.");
                }
                // Llamar al servicio para asignar la dieta
                yield diets_services_1.default.assignDietByEmail(email, Number(dietId));
                res
                    .status(200)
                    .json({ message: "Dieta asignada correctamente al cliente." });
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getDietsByNutritionist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id || isNaN(Number(id))) {
                    throw new Error("ID de nutriólogo inválido.");
                }
                const diets = yield diets_services_1.default.getDietsByNutritionist(Number(id));
                res.status(200).json(diets);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getDietsByClient(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // Obtener el clientId de los parámetros de la URL
                const diets = yield diets_services_1.default.getDietsByClient(Number(id)); // Llamar al servicio
                res.status(200).json(diets); // Devolver las dietas al cliente
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message)); // Manejar errores
            }
        });
    }
}
exports.default = new DietController();

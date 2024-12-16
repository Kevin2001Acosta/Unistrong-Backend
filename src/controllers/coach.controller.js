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
const coach_services_1 = __importDefault(require("../services/coach/coach.services"));
const http_errors_1 = __importDefault(require("http-errors"));
class CoachController {
    createCoach(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coach = yield coach_services_1.default.createCoach(req.body);
                res.status(201).json(coach);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getAllCoaches(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coaches = yield coach_services_1.default.getAllCoach();
                res.status(200).json(coaches);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getCoachById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coachId = parseInt(req.params.id);
                if (isNaN(coachId)) {
                    throw new Error("ID de coach inválido");
                }
                const coach = yield coach_services_1.default.getCoachById(coachId);
                res.status(200).json(coach);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getClientsByCoachId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coachId = parseInt(req.params.id);
                if (isNaN(coachId)) {
                    throw new Error("ID de coach inválido");
                }
                const coachWithClients = yield coach_services_1.default.getClientsByCoachId(coachId);
                res.status(200).json(coachWithClients);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
}
exports.default = new CoachController();

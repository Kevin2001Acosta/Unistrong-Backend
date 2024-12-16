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
const reservations_services_1 = __importDefault(require("../services/reservations/reservations.services"));
const http_errors_1 = __importDefault(require("http-errors"));
class ReservationController {
    createReservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservation = yield reservations_services_1.default.createReservation(req.body);
                res.status(201).json(reservation);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
    getAllReservations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservations = yield reservations_services_1.default.getAllReservations();
                res.status(200).json(reservations);
            }
            catch (error) {
                next((0, http_errors_1.default)(400, error.message));
            }
        });
    }
}
exports.default = new ReservationController();

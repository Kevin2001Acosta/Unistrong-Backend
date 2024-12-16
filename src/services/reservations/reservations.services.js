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
const client_models_1 = __importDefault(require("../../db/models/client.models"));
const reservations_models_1 = __importDefault(require("../../db/models/reservations.models"));
class ReservationsServices {
    createReservation(reservationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield client_models_1.default.findByPk(reservationData.clientId);
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                const classes = yield classes_models_1.default.findByPk(reservationData.classId);
                if (!classes) {
                    throw new Error("Clase no encontrada");
                }
                const existingReservation = yield reservations_models_1.default.findOne({
                    where: {
                        clientId: reservationData.clientId,
                        classId: reservationData.classId,
                    },
                });
                if (existingReservation) {
                    throw new Error("El cliente ya ha reservado esta clase.");
                }
                const reservation = yield reservations_models_1.default.create(reservationData);
                return reservation;
            }
            catch (error) {
                throw new Error(`Error al crear la reserva: ${error.message}`);
            }
        });
    }
    getAllReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservations = yield reservations_models_1.default.findAll({
                    include: [
                        {
                            model: client_models_1.default,
                            as: "assistants",
                            attributes: ["id"],
                        },
                        {
                            model: classes_models_1.default,
                            as: "class",
                        },
                    ],
                });
                return reservations.length > 0 ? reservations : [];
            }
            catch (error) {
                throw new Error(`Error al obtener las reservas: ${error.message}`);
            }
        });
    }
}
exports.default = new ReservationsServices();

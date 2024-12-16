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
const membership_payment_models_1 = __importDefault(require("../../db/models/membership.payment.models"));
const client_services_1 = __importDefault(require("../client/client.services"));
class MembershipServices {
    registerMembership(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // verificar que el cliente exista y devolver su tipo de membresía y el valor a pagar
                const client = yield client_services_1.default.getClientByUserId(userId);
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                if (!client.membership) {
                    throw new Error("El cliente no tiene un tipo de membresía asignado");
                }
                const { remainingDays } = yield this.getMembershipRemainingDays(userId);
                if (remainingDays > 0) {
                    throw new Error("No puedes pagar una membresía si tienes una activa");
                }
                // registrar la membresía
                const membership = yield membership_payment_models_1.default.create({
                    clientId: client.id,
                    startDate,
                    endDate,
                    amount: client.membership.price,
                });
                return membership;
            }
            catch (error) {
                throw new Error(`Error al pagar membresía: ${error.message}`);
            }
        });
    }
    getMembershipRemainingDays(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // verificar que el cliente exista y devolver los días restantes de la membresía
                const client = yield client_services_1.default.getClientByUserId(userId);
                if (!client) {
                    throw new Error("Cliente no encontrado");
                }
                if (!client.membership) {
                    throw new Error("El cliente no tiene un tipo de membresía asignado");
                }
                // obtener los días restantes de la membresía
                const membership = yield membership_payment_models_1.default.findOne({
                    where: { clientId: client.id, active: true },
                    order: [["createdAt", "DESC"]], // trae el pago más reciente
                });
                if (!membership) {
                    return {
                        remainingDays: 0, // positivo, no ha vencido; negativo, ya vencio
                        message: "No tienes membresías pagadas aún", // mensaje personalizado
                    };
                }
                // Calcular los días restantes
                const endDate = new Date(membership.endDate);
                const today = new Date();
                const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                // Determinar el mensaje personalizado
                const message = remainingDays > 0
                    ? `Tu membresía vence el ${endDate}.`
                    : `Tu membresía venció el ${endDate.toLocaleDateString()}.`;
                return {
                    remainingDays, // positivo, no ha vencido; negativo, ya venció
                    endDate, // fecha de vencimiento
                    message, // mensaje personalizado
                };
            }
            catch (error) {
                throw new Error(`Error al obtener los días restantes de la membresía: ${error.message}`);
            }
        });
    }
}
exports.default = new MembershipServices();

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
// src/services/verification.service.ts
const verification_models_1 = __importDefault(require("../../db/models/verification.models"));
const verification_type_1 = require("../../db/models/utils/verification.type");
const user_services_1 = __importDefault(require("../user/user.services"));
class VerificationService {
    createVerificationCode(userId, code, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield verification_models_1.default.update(// Actualiza las verificaciones anteriores a verificadas para evitar errores
            { active: false }, { where: { userId, active: true, verified: false, type } });
            const HORA = 1; // 1 hora
            yield verification_models_1.default.create({
                userId,
                code,
                expiration_date: new Date(Date.now() + HORA * 60 * 60 * 1000), // Código válido por 1 hora
                type
            });
        });
    }
    ;
    verifyCodeoOfPassword(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_services_1.default.getUserByEmail(email);
            if (!user) {
                throw new Error("El email no está registrado");
            }
            const verification = yield verification_models_1.default.findOne({
                where: {
                    userId: user.id,
                    code,
                    active: true,
                    verified: false,
                    type: verification_type_1.VerificationType.Password,
                },
            });
            if (!verification) {
                throw new Error("Código de verificación inválido");
            }
            if (verification.expiration_date < new Date()) {
                throw new Error("Código de verificación expirado");
            }
            // Marcar el código como verificado
            verification.verified = true;
            verification.active = false;
            yield verification.save();
            return true;
        });
    }
    verifyCodeoOfEmail(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_services_1.default.getUserById(id);
            if (!user) {
                throw new Error("El usuario no está registrado");
            }
            const verification = yield verification_models_1.default.findOne({
                where: {
                    userId: id,
                    code,
                    active: true,
                    verified: false,
                    type: verification_type_1.VerificationType.Email,
                },
            });
            if (!verification) {
                throw new Error("Código de verificación inválido");
            }
            if (verification.expiration_date < new Date()) {
                throw new Error("Código de verificación expirado");
            }
            // Marcar el código como verificado
            verification.verified = true;
            // desactivar la verificación
            verification.active = false;
            yield verification.save();
            return true;
        });
    }
    isClientVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_services_1.default.getUserById(id);
            if (!user) {
                throw new Error("El usuario no está registrado");
            }
            const verified = yield verification_models_1.default.findOne({
                where: {
                    userId: id,
                    active: false,
                    verified: true,
                    type: verification_type_1.VerificationType.Email,
                },
            });
            if (!verified) {
                return false;
            }
            return true;
        });
    }
}
exports.default = new VerificationService();

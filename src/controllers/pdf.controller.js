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
const generatedPdf_services_1 = __importDefault(require("../services/client/generatedPdf.services"));
const user_services_1 = __importDefault(require("../services/user/user.services"));
const email_service_1 = require("../services/email.service");
class StatisticsController {
    generateStatisticsPDF(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                const pdfBuffer = yield generatedPdf_services_1.default.generateStatisticsPDF(userId);
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "attachment; filename=statistics.pdf");
                res.send(pdfBuffer);
            }
            catch (error) {
                next(error);
            }
        });
    }
    generateAndSendPDF(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                const pdfBuffer = yield generatedPdf_services_1.default.generateStatisticsPDF(userId);
                // obtener correo electrónico
                const user = yield user_services_1.default.getUserById(userId);
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }
                // enviar correo electrónico
                const emailService = new email_service_1.EmailService();
                yield emailService.sendEmail({
                    to: user.email,
                    subject: "Estadísticas de cliente",
                    text: "Estadísticas de cliente",
                    attachments: [
                        {
                            filename: "statistics.pdf",
                            content: pdfBuffer,
                            contentType: "application/pdf",
                        },
                    ],
                });
                res.status(200).json({ message: "Correo electrónico enviado correctamente con pdf" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new StatisticsController();

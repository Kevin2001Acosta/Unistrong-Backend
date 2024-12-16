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
exports.verifyEmail = exports.sendVerificationEmail = exports.changePassword = exports.verifyCode = exports.sendVerificationCode = void 0;
const email_service_1 = require("../services/email.service");
const verification_type_1 = require("../db/models/utils/verification.type");
const auth_services_1 = __importDefault(require("../services/user/auth.services"));
const verification_services_1 = __importDefault(require("../services/verification/verification.services"));
const user_services_1 = __importDefault(require("../services/user/user.services"));
const sendVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body; // extrae el email del cuerpo de la petición
    let user;
    try {
        user = yield user_services_1.default.getUserByEmail(email); // verifica si el email existe
        if (!user) {
            res.status(404).json({ message: "El email no está registrado" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error al verificar el email", error: error.message });
        console.log(error);
        return;
    }
    // generamos un código aleatorio de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const HORA = 1; // 1 hora
    const emailService = new email_service_1.EmailService(); // instancia el servicio de email
    try {
        yield verification_services_1.default.createVerificationCode(BigInt(user.id), verificationCode.toString(), verification_type_1.VerificationType.Password); // guarda el código en la base de datos
        yield emailService.sendEmail({
            to: email,
            subject: "Código de verificación para recuperar su contraseña",
            text: `Su código para recuperar la contraseña de UNISTRONG es ${verificationCode},\nNo lo comparta con nadie.`,
        });
        res.status(200).json({ message: "Código de verificación enviado" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al enviar el código o registrarlo en base de datos", error: error.message });
        console.log(error);
    }
});
exports.sendVerificationCode = sendVerificationCode;
const verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    try {
        yield verification_services_1.default.verifyCodeoOfPassword(email, code);
        res.status(200).json({
            message: "Código de verificación válido",
            pass: true
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            pass: false
        });
    }
});
exports.verifyCode = verifyCode;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: "El email es obligatorio" });
            return;
        }
        yield user_services_1.default.changePassword(email, password);
        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.changePassword = changePassword;
const sendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body; // extrae el email del cuerpo de la petición
    let user;
    try {
        user = yield user_services_1.default.getUserByEmail(email); // verifica si el email existe
        if (!user) {
            res.status(404).json({ message: "El email no está registrado" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error al verificar el email", error: error.message });
        console.log(error);
        return;
    }
    // generamos un código aleatorio de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    console.log(user.id);
    const token = auth_services_1.default.generateTokenEmail(user.id, verificationCode.toString());
    const emailService = new email_service_1.EmailService(); // instancia el servicio de email
    try {
        yield verification_services_1.default.createVerificationCode(BigInt(user.id), verificationCode.toString(), verification_type_1.VerificationType.Email);
        yield emailService.sendEmail({
            to: email,
            subject: "¡Verifica tu correo electrónico de UNISTRONG! 💪",
            text: `
            ¡Hola!
            
            Gracias por registrarte en UNISTRONG. 
            Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:

            Verificar mi correo electrónico: ´http://localhost:5173/validacion?token=${token}´

            Si no te registraste en UNISTRONG, simplemente puedes ignorar este correo.


            © 2024 UNISTRONG. Todos los derechos reservados.
            `,
        });
        res.status(200).json({ message: "Email de verificacion enviado" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al enviar el email de verificacion", error: error.message });
        console.log(error);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    try {
        // Verificar el token y obtener el usuario
        const user = auth_services_1.default.verifyToken(token);
        // Verificar el código de verificación
        yield verification_services_1.default.verifyCodeoOfEmail(user.id, user.code);
        // Enviar respuesta de éxito
        res.status(200).json({
            message: "Código de verificación válido y estado actualizado.",
            pass: true
        });
    }
    catch (error) {
        // Enviar respuesta de error
        res.status(400).json({
            message: error.message,
            pass: false
        });
    }
});
exports.verifyEmail = verifyEmail;

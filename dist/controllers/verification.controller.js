import { EmailService } from "../services/email.service";
import { VerificationType } from "../db/models/utils/verification.type";
import AuthService from "../services/user/auth.services";
import verificationService from "../services/verification/verification.services";
import userServices from "../services/user/user.services";
import UserModel from "../db/models/user.model";
export const sendVerificationCode = async (req, res) => {
    const { email } = req.body; // extrae el email del cuerpo de la petición
    let user;
    try {
        user = await userServices.getUserByEmail(email); // verifica si el email existe
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
    const emailService = new EmailService(); // instancia el servicio de email
    try {
        await verificationService.createVerificationCode(BigInt(user.id), verificationCode.toString(), VerificationType.Password); // guarda el código en la base de datos
        await emailService.sendEmail({
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
};
export const verifyCode = async (req, res) => {
    const { email, code } = req.body;
    try {
        await verificationService.verifyCodeoOfPassword(email, code);
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
};
export const changePassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: "El email es obligatorio" });
            return;
        }
        await userServices.changePassword(email, password);
        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const sendVerificationEmail = async (req, res) => {
    const { email } = req.body; // extrae el email del cuerpo de la petición
    let user;
    try {
        user = await userServices.getUserByEmail(email); // verifica si el email existe
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
    const token = AuthService.generateTokenEmail(user.id, verificationCode.toString());
    const emailService = new EmailService(); // instancia el servicio de email
    try {
        await verificationService.createVerificationCode(BigInt(user.id), verificationCode.toString(), VerificationType.Email);
        await emailService.sendEmail({
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
};
export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        // Verificar el token y obtener el usuario
        const user = AuthService.verifyToken(token);
        // Verificar el código de verificación
        await verificationService.verifyCodeoOfEmail(user.id, user.code);
        // Actualizar el estado de verificación del usuario en la base de datos
        await UserModel.update({ state: true }, // Cambia el estado a verdadero
        { where: { id: user.id } });
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
};

import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { VerificationType } from "../models/utils/verification.type";

import verificationService, { userResponse } from "../services/verification/verification.services";
import userServices from "../services/user/user.services";
import Users from "../models/user.model";

interface VerificationRequest extends Request { // recibe el email del usuario
    body: {
        email: string;
    };
}

interface VerificationCodeRequest extends Request { // recibe el email y el código del usuario
    body: {
        email: string;
        code: string;
    };
}

export const sendVerificationCode = async (req: VerificationRequest, res: Response): Promise<void> => {
    const { email } = req.body; // extrae el email del cuerpo de la petición
    let user: Users | null;
    try{
        user = await userServices.getUserByEmail(email); // verifica si el email existe
        if(!user){
            res.status(404).json({ message: "El email no está registrado" });
            return;
        }

    }catch(error){
        res.status(500).json({ message: "Error al verificar el email", error: (error as Error).message });
        console.log(error);
        return;
    }

    // generamos un código aleatorio de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const HORA: number = 1; // 1 hora

    const emailService: EmailService = new EmailService(); // instancia el servicio de email
    try{
        
        await verificationService.createVerificationCode(BigInt(user.id), verificationCode.toString(), VerificationType.Password); // guarda el código en la base de datos
        
        await emailService.sendEmail({ // envía el código por email
            to: email,
            subject: "Código de verificación para recuperar su contraseña",
            text: `Su código para recuperar la contraseña de UNISTRONG es ${verificationCode},\nNo lo comparta con nadie.`,
        });        
        res.status(200).json({ message: "Código de verificación enviado" });

    } catch (error) {
        res.status(500).json({ message: "Error al enviar el código o registrarlo en base de datos", error: (error as Error).message });
        console.log(error);
    }
}

export const verifyCode = async (req: VerificationCodeRequest, res: Response): Promise<void> => {
    const {email, code} = req.body;

    try{

        await verificationService.verifyCodeoOfPassword(email, code);

        res.status(200).json({ 
            message: "Código de verificación válido",
            pass: true
         });


    }catch(error){
        res.status(400).json({
            message: (error as Error).message,
            pass: false
        });
    }
}
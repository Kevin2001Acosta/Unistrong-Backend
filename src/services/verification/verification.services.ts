// src/services/verification.service.ts
import Verification from "../../models/verification.models";
import { VerificationType } from "../../models/utils/verification.type";
import userServices from "../user/user.services";


export interface userResponse {
  id?: bigint;
  exists: boolean;
}

class VerificationService {
  
  async createVerificationCode(userId: bigint, code: string, type: VerificationType): Promise<void> {
    if(type === VerificationType.Password){
      await Verification.update( // Actualiza las verificaciones anteriores a verificadas para evitar errores
        {verified: true},
        {where: {userId, active: true, verified: false}}
      );
    }
    const HORA: number = 1; // 1 hora
    await Verification.create({ // Crea una nueva verificación
      userId,
      code,
      expiration_date: new Date(Date.now() + HORA * 60 * 60 * 1000), // Código válido por 1 hora
      type
    });
  };

  async verifyCodeoOfPassword(email: string, code: string): Promise<boolean> {
    const user = await userServices.getUserByEmail(email);
    if (!user) {
      throw new Error("El email no está registrado");
    }

    const verification = await Verification.findOne({
      where: {
        userId: user.id,
        code,
        active: true,
        verified: false,
        type: VerificationType.Password,
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
    await verification.save();

    return true;
  }
}

export default new VerificationService();
// src/services/verification.service.ts
import Verification from "../../db/models/verification.models";
import { VerificationType } from "../../db/models/utils/verification.type";
import userServices from "../user/user.services";


export interface userResponse {
  id?: bigint;
  exists: boolean;
}

class VerificationService {
  
  async createVerificationCode(userId: bigint, code: string, type: VerificationType): Promise<void> {

    await Verification.update( // Actualiza las verificaciones anteriores a verificadas para evitar errores
      {active: false},
      {where: {userId, active: true, verified: false, type}}
    );
    
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
    verification.active = false;
    await verification.save();

    return true;
  }

  async verifyCodeoOfEmail(id: number, code: string): Promise<boolean> {
    const user = await userServices.getUserById(id);
    if (!user) {
      throw new Error("El usuario no está registrado");
    }

    const verification = await Verification.findOne({
      where: {
        userId: id,
        code,
        active: true,
        verified: false,
        type: VerificationType.Email,
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
    
    await verification.save();

    return true;
  }
}

export default new VerificationService();
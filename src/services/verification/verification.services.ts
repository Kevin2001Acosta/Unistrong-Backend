// src/services/verification.service.ts
import Verification from "../../models/verification.models";
import { VerificationType } from "../../models/utils/verification.type";
import userServices from "../user/user.services";

export interface userResponse {
  id?: bigint;
  exists: boolean;
}

class VerificationService {

 async verificationEmailExists(email: string): Promise<userResponse>  {
  const user = await userServices.getUserByEmail(email);
  if (user) {
    return { id: BigInt(user.id), exists: true };
  }
  return { exists: false };
};

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
}

export default new VerificationService();
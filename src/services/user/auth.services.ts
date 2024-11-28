import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../db/config/config.auth";

class AuthService {
  async hashPassword(password: string): Promise<string> {
    try {
      const hash: string = await bcrypt.hash(password, 10);
      return hash;
    } catch (error) {
      throw new Error(
        "Error al hashear la contraseña: " + (error as Error).message
      );
    }
  }
  async comparePasswords(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error(
        "Error al comparar las contraseñas: " + (error as Error).message
      );
    }
  }

  // crear jwt
  generateToken(userId: number): string {
    const token = jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: "1h", // Token expira en 1 hora
    });
    return token;
  }
  //verificar token
  verifyToken(token: string): any {
    return jwt.verify(token, config.jwtSecret);
  }

  generateTokenEmail(userId: number, code: string): string {
    const token = jwt.sign({ id: userId, code: code }, config.jwtSecret, {
      expiresIn: "1h", // Token expira en 1 hora
    });
    return token;
  }
}
export default new AuthService();

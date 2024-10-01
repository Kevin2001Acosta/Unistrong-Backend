import * as bcrypt from "bcrypt";

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
}
export default new AuthService();

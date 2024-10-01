import { UserAtributes } from "../../schemas/user/user.schema";
import { UserInput } from "../../schemas/user/user.input.schema";
import Users from "../../db/models/user.model";
import AuthService from "././auth.services";

class UserService {
  async createUser(userData: UserInput): Promise<UserAtributes> {
    try {
      console.log("usuario:", userData);
      // Hashear la contraseña
      const hashedPassword = await AuthService.hashPassword(userData.password);
      // Crear el usuario con la contraseña hasheada
      const user = await Users.create({
        ...userData,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      console.error("Error en la creación del usuario:", error);
      throw new Error(`Error al crear el usuario: ${(error as Error).message}`);
    }
  }

  async getAllUsers(): Promise<UserAtributes[]> {
    try {
      const users = await Users.findAll();
      return users.length > 0 ? users : [];
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async getUserById(id: number): Promise<UserAtributes | null> {
    try {
      const user = await Users.findByPk(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario: ${(error as Error).message}`
      );
    }
  }
}

export default new UserService();

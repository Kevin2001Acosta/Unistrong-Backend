// servicio
import { UserAttributes } from "../schemas/user/user.schema";
import { UserInput } from "../schemas/user/user.input.schema";
import Users from "../db/models/user.model";

class UserService {
  async createUser(userData: UserInput): Promise<UserAttributes> {
    try {
      console.log("Datos recibidos para crear usuario:", userData);
      const user = await Users.create(userData);
      return user;
    } catch (error) {
      console.error("Error en la creación del usuario:", error);
      throw new Error(`Error al crear el usuario: ${(error as Error).message}`);
    }
  }

  async getAllUsers(): Promise<UserAttributes[]> {
    try {
      const users = await Users.findAll();
      return users.length > 0 ? users : [];
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${(error as Error).message}`);
    }
  }

  async getUserById(id: number): Promise<UserAttributes | null> {
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

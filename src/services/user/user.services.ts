import { UserAtributes } from "../../schemas/user/user.schema";
import { UserState } from "../../models/utils/user.state";
import { UserInput } from "../../schemas/user/user.input.schema";
import Users from "../../models/user.model";
import AuthService from "././auth.services";
import createError from "http-errors";
import { UniqueConstraintError } from "sequelize";
import {
  isStrongPassword,
  isValidUsername,
} from "../../models/utils/constraints";

class UserService {
  async createUser(userData: UserInput): Promise<UserAtributes> {
    try {
      console.log("usuario:", userData);

      // Validaciones de contraseña y nombre de usuario
      isStrongPassword(userData.password);
      isValidUsername(userData.username);

      // Hashear la contraseña
      const hashedPassword = await AuthService.hashPassword(userData.password);

      // Crear el usuario
      const user = await Users.create({
        ...userData,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      // Errores de unicidad
      if (error instanceof UniqueConstraintError) {
        if ((error.parent as any)?.constraint === "users_email_key") {
          throw createError(409, "El correo electrónico ya está registrado.");
        }
        if ((error.parent as any)?.constraint === "users_username_key") {
          throw createError(409, "El nombre de usuario ya está en uso.");
        }
        if ((error.parent as any)?.constraint === "users_dni_key") {
          throw createError(409, "El DNI ya está registrado.");
        }
        throw createError(409, "Ya existe un registro con este dato.");
      }
      // Error general
      throw createError(
        400,
        `Error al crear el usuario: ${(error as Error).message}`
      );
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

  async getUserByEmail(email: string): Promise<Users | null> {
    try {
      const user = await Users.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario: ${(error as Error).message}`
      );
    }
  }




  async changePassword(email: string, password: string): Promise<void> {
    const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error("El email no está registrado");
    }
    isStrongPassword(password);

    const hashedPassword = await AuthService.hashPassword(password);

    await Users.update({ password: hashedPassword }, { where: { id: user.id } });

  }


}

export default new UserService();

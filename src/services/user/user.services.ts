import { UserAtributes } from "../../schemas/user/user.schema";
import { UserInput } from "../../schemas/user/user.input.schema";
import Users from "../../db/models/user.model";
import AuthService from "././auth.services";
import createError from "http-errors";
import { UniqueConstraintError, where } from "sequelize";
import {
  isStrongPassword,
  isValidUsername,
} from "../../db/models/utils/constraints";
import Client from "../../db/models/client.models";
import { UserType } from "../../db/models/utils/user.types";
import Coach from "../../db/models/coach.models";
import Nutritionist from "../../db/models/nutritionist.model";
import ClientCharacteristics from "../../db/models/client.characteristics.models";

class UserService {
  updateUser(user: UserAtributes) {
    throw new Error("Method not implemented.");
  }
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
        state: true,
      });

      //Crear tambien en la tabla cliente si es un cliente
      if (user.userType === UserType.CLIENT) {
        await Client.create({
          user_id: user.id,
        });
        console.log("cliente creado");
      }
      //Crear tambien en la tabla nutriologo si es un nutriologo
      if (user.userType === UserType.NUTRITIONIST) {
        await Nutritionist.create({
          user_id: user.id,
        });
        console.log("nutriologo creado");
      }
      //Crear tambien en la tabla coach si es un coach
      if (user.userType === UserType.COACH) {
        await Coach.create({
          user_id: user.id,
        });
        console.log("coach creado");
      }
      return user;
    } catch (error) {
      // Manejo específico de errores de unicidad
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

    await Users.update(
      { password: hashedPassword },
      { where: { id: user.id } }
    );
  }

  async disableAccount(id: number): Promise<void> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("El email no está registrado");
    }

    await Users.update({ state: false }, { where: { id: user.id } });
  }

  async getpasswordById(id: number): Promise<string> {
    try {
      const user = await Users.findOne({
        where: { id },
        attributes: ["password"],
      });
      return user ? user.password : "";
    } catch (error) {
      throw new Error(
        `Error al obtener la contraseña: ${(error as Error).message}`
      );
    }
  }

  // Método para actualizar el nombre del usuario
  async updateUserProfile(
    id: number,
    updateData: { name?: string; phoneNumber?: string; password?: string }
  ): Promise<UserAtributes> {
    try {
      // Verificamos si el usuario existe en la base de datos
      const user = await Users.findByPk(id); // findByPk devuelve una instancia de Sequelize o null
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizamos solo los campos presentes en updateData
      if (updateData.name) user.name = updateData.name;
      if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber;
      if (updateData.password) {
        user.password = await AuthService.hashPassword(updateData.password); // Si se proporciona contraseña, la hasheamos
      }

      await user.save(); // Guardamos los cambios, ya que 'user' es una instancia de Sequelize

      return user; // Retornamos el usuario actualizado
    } catch (error) {
      throw new Error(
        `Error al actualizar el perfil: ${(error as Error).message}`
      );
    }
  }

  async updateUserMeasurements(
    id: number,
    updateData: {weight?: number; height?:number; waist?: number; legs?: number, arms?: number,
      chest?:number, glutes?: number}
  ): Promise<ClientCharacteristics> {
    try {
      // Verificamos si el usuario existe en la base de datos
      const user = await Users.findByPk(id); // findByPk devuelve una instancia de Sequelize o null
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
            // findByPk devuelve una instancia de Sequelize o null
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const cliente = await Client.findOne({
        where: {
          user_id: id,
        }
      });

      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      const validData: Partial<ClientCharacteristics> = {};
      if (cliente.id) validData.id = cliente.id;
      if (updateData.weight) validData.weight = updateData.weight;
      if (updateData.height) validData.height = updateData.height;
      if (updateData.waist) validData.waist = updateData.waist;
      if (updateData.legs) validData.legs = updateData.legs;
      if (updateData.arms) validData.arms = updateData.arms;
      if (updateData.chest) validData.chest = updateData.chest;
      if (updateData.glutes) validData.glutes = updateData.glutes;

      if (Object.keys(validData).length === 0) {
        throw new Error("No se proporcionaron datos válidos para actualizar");
      }

      const characteristicsData: any = {
        clientId: cliente.id,
        weight: validData.weight,
        height: validData.height,
        waist: validData.waist,
        legs: validData.legs,
        arms: validData.arms,
        chest: validData.chest,
        glutes: validData.glutes,
      };

      Object.keys(characteristicsData).forEach(
        (key) => characteristicsData[key] === undefined && delete characteristicsData[key]
      );
      const characteristics = await ClientCharacteristics.create(characteristicsData);

      return characteristics;
  
    } catch (error) {
      throw new Error(
        `Error al actualizar el perfil: ${(error as Error).message}`
      );
    }
  }
}


export default new UserService();

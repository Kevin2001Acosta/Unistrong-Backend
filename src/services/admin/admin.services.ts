import Admin from "../../db/models/admin.models";
import Client from "../../db/models/client.models";
import Coach from "../../db/models/coach.models";
import Nutritionist from "../../db/models/nutritionist.model";
import Users from "../../db/models/user.model";
import {
  isStrongPassword,
  isValidUsername,
} from "../../db/models/utils/constraints";
import { UserType } from "../../db/models/utils/user.types";
import { AdminInput } from "../../schemas/admin/admin.schema";
import { CoachInputAdmin } from "../../schemas/coach/coach.input.admin";
import { NutriInputAdmin } from "../../schemas/nutritionist/nutri.input.admin";
import { UserInput } from "../../schemas/user/user.input.schema";
import { UserAtributes } from "../../schemas/user/user.schema";
import { UniqueConstraintError } from "sequelize";
import createError from "http-errors";
import AuthService from "../../services/user/auth.services";

class AdminService {
  async createAdmin(adminData: AdminInput): Promise<Admin> {
    const user = await Users.findOne({ where: { email: adminData.email } });

    if (!user) {
      throw new Error("El usuario con el email proporcionado no existe.");
    }

    const existingAdmin = await Admin.findOne({ where: { user_id: user.id } });
    if (existingAdmin) {
      throw new Error("El usuario ya está registrado como administrador.");
    }

    user.userType = UserType.ADMIN;
    await user.save();

    const newAdmin = await Admin.create({ user_id: user.id });
    return newAdmin;
  }

  async createUserAnyType(userData: UserInput): Promise<UserAtributes> {
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
        state:true,
        password: hashedPassword,
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

  async assignCoachToClient(
    clientEmail: string,
    coachEmail: string
  ): Promise<void> {
    //Buscar al cliente por email
    const clientUser = await Users.findOne({
      where: { email: clientEmail, userType: UserType.CLIENT },
    });

    if (!clientUser) {
      throw createError(404, "El cliente no existe o no tiene el tipo CLIENT.");
    }

    //Verificar si el cliente ya tiene un coach asignado
    const client = await Client.findOne({ where: { user_id: clientUser.id } });

    if (!client) {
      throw createError(
        404,
        "El cliente no tiene un perfil en la tabla Clients."
      );
    }

    if (client.coach_id) {
      throw createError(400, "El cliente ya tiene un coach asignado.");
    }

    //Buscar al coach por email
    const coachUser = await Users.findOne({
      where: { email: coachEmail, userType: UserType.COACH },
    });

    if (!coachUser) {
      throw createError(404, "El coach no existe o no tiene el tipo COACH.");
    }

    //Verificar si el coach está registrado en la tabla Coaches
    const coach = await Coach.findOne({ where: { user_id: coachUser.id } });

    if (!coach) {
      throw createError(
        404,
        "El coach no tiene un perfil en la tabla Coaches."
      );
    }

    //Asignar el coach al cliente
    client.coach_id = coach.id;
    await client.save();
  }

  async assignNutritionistToClient(
    clientEmail: string,
    nutriEmail: string
  ): Promise<void> {
    //Buscar al cliente por email
    const clientUser = await Users.findOne({
      where: { email: clientEmail, userType: UserType.CLIENT },
    });

    if (!clientUser) {
      throw createError(404, "El cliente no existe o no tiene el tipo CLIENT.");
    }

    //Verificar si el cliente ya tiene un coach asignado
    const client = await Client.findOne({ where: { user_id: clientUser.id } });

    if (!client) {
      throw createError(
        404,
        "El cliente no tiene un perfil en la tabla Clients."
      );
    }

    if (client.nutritionist_id) {
      throw createError(400, "El cliente ya tiene un nutriologo asignado.");
    }

    //Buscar al coach por email
    const nutri = await Users.findOne({
      where: { email: nutriEmail, userType: UserType.NUTRITIONIST },
    });

    if (!nutri) {
      throw createError(404, "El coach no existe.");
    }

    //Verificar si el coach está registrado en la tabla Coaches
    const nutriExist = await Nutritionist.findOne({
      where: { user_id: nutri.id },
    });

    if (!nutriExist) {
      throw createError(404, "El coach no tiene un perfil.");
    }

    //Asignar el nutriologo al cliente
    client.nutritionist_id = nutriExist.id;
    await client.save();
  }

  async AdminExist(id: number): Promise<boolean | null> {
    try {
      const admin = await Admin.findOne({
        where: {
          user_id: id,
        },
        attributes: ["user_id"],
      });

      if (!admin) {
        throw new Error("El administrador no existe");
      }

      return true;
    } catch (error) {
      throw new Error(
        `Error al obtener el administrador: ${(error as Error).message}`
      );
    }
  }

  async deactivateUsers(emails: string[]): Promise<void> {
    try {
      // Verificar si la lista de correos no está vacía
      if (!emails || emails.length === 0) {
        throw createError(400, "Debe proporcionar al menos un email.");
      }

      // Buscar usuarios por sus correos electrónicos
      const users = await Users.findAll({
        where: {
          email: emails,
        },
      });

      // Validar si todos los correos proporcionados corresponden a usuarios existentes
      const foundEmails = users.map((user) => user.email);
      const notFoundEmails = emails.filter(
        (email) => !foundEmails.includes(email)
      );

      if (notFoundEmails.length > 0) {
        throw createError(
          404,
          `No se encontraron los siguientes usuarios: ${notFoundEmails.join(
            ", "
          )}.`
        );
      }

      // Desactivar los usuarios encontrados
      await Users.update(
        { state: false }, // Actualizar el estado a `false`
        {
          where: {
            email: emails,
          },
        }
      );
    } catch (error) {
      throw createError(
        400,
        `Error al desactivar usuarios: ${(error as Error).message}`
      );
    }
  }

  async updateUsersState(
    emails: { email: string; state: boolean }[]
  ): Promise<void> {
    try {
      for (const { email } of emails) {
        // Buscar al usuario por email
        const user = await Users.findOne({ where: { email } });

        if (!user) {
          throw new Error(`El usuario con el email ${email} no existe.`);
        }

        console.log(`Estado actual de ${email}: ${user.state}`); // Para depuración

        // Cambiar el estado del usuario: si es 'false', cambiar a 'true' y viceversa
        user.state = !user.state; // Invierte el estado
        console.log(`Nuevo estado de ${email}: ${user.state}`); // Para depuración

        // Guardar los cambios en la base de datos
        await user.save();
      }
    } catch (error) {
      throw new Error(
        `Error al actualizar el estado de los usuarios: ${
          (error as Error).message
        }`
      );
    }
  }
}

export default new AdminService();

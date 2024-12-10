import Users from "../../db/models/user.model";
import AuthService from "././auth.services";
import createError from "http-errors";
import { UniqueConstraintError } from "sequelize";
import { isStrongPassword, isValidUsername, } from "../../db/models/utils/constraints";
import Client from "../../db/models/client.models";
import { UserType } from "../../db/models/utils/user.types";
import Coach from "../../db/models/coach.models";
import Nutritionist from "../../db/models/nutritionist.model";
class UserService {
    updateUser(user) {
        throw new Error("Method not implemented.");
    }
    async createUser(userData) {
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
        }
        catch (error) {
            // Manejo específico de errores de unicidad
            if (error instanceof UniqueConstraintError) {
                if (error.parent?.constraint === "users_email_key") {
                    throw createError(409, "El correo electrónico ya está registrado.");
                }
                if (error.parent?.constraint === "users_username_key") {
                    throw createError(409, "El nombre de usuario ya está en uso.");
                }
                if (error.parent?.constraint === "users_dni_key") {
                    throw createError(409, "El DNI ya está registrado.");
                }
                throw createError(409, "Ya existe un registro con este dato.");
            }
            throw createError(400, `Error al crear el usuario: ${error.message}`);
        }
    }
    async getAllUsers() {
        try {
            const users = await Users.findAll();
            return users.length > 0 ? users : [];
        }
        catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }
    async getUserById(id) {
        try {
            const user = await Users.findByPk(id);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            return user;
        }
        catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await Users.findOne({ where: { email } });
            return user;
        }
        catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }
    async changePassword(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new Error("El email no está registrado");
        }
        isStrongPassword(password);
        const hashedPassword = await AuthService.hashPassword(password);
        await Users.update({ password: hashedPassword }, { where: { id: user.id } });
    }
    async disableAccount(id) {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error("El email no está registrado");
        }
        await Users.update({ state: false }, { where: { id: user.id } });
    }
    async getpasswordById(id) {
        try {
            const user = await Users.findOne({
                where: { id },
                attributes: ["password"],
            });
            return user ? user.password : "";
        }
        catch (error) {
            throw new Error(`Error al obtener la contraseña: ${error.message}`);
        }
    }
    // Método para actualizar el nombre del usuario
    async updateUserProfile(id, updateData) {
        try {
            // Verificamos si el usuario existe en la base de datos
            const user = await Users.findByPk(id); // findByPk devuelve una instancia de Sequelize o null
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            // Actualizamos solo los campos presentes en updateData
            if (updateData.name)
                user.name = updateData.name;
            if (updateData.phoneNumber)
                user.phoneNumber = updateData.phoneNumber;
            if (updateData.password) {
                user.password = await AuthService.hashPassword(updateData.password); // Si se proporciona contraseña, la hasheamos
            }
            await user.save(); // Guardamos los cambios, ya que 'user' es una instancia de Sequelize
            return user; // Retornamos el usuario actualizado
        }
        catch (error) {
            throw new Error(`Error al actualizar el perfil: ${error.message}`);
        }
    }
}
export default new UserService();

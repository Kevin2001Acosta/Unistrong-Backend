import Client from "../../db/models/client.models";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";
import Coach from "../../db/models/coach.models";
import Nutritionist from "../../db/models/nutritionist.model";
import Routines from "../../db/models/routines.models";
import Diets from "../../db/models/diets.models";
import Membership from "../../db/models/membership.models";
class ClientService {
    async createClient(clientData) {
        try {
            // Verificar si el usuario existe
            const user = await Users.findByPk(clientData.user_id);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            if (user.userType !== UserType.CLIENT) {
                throw new Error("El usuario no es del tipo cliente");
            }
            // Verificar si el coach existe
            if (clientData.coach_id) {
                const coach = await Coach.findByPk(clientData.coach_id);
                if (!coach) {
                    throw new Error("El coach especificado no existe");
                }
            }
            // Verificar si el nutriólogo existe
            if (clientData.nutritionist_id) {
                const nutritionist = await Nutritionist.findByPk(clientData.nutritionist_id);
                if (!nutritionist) {
                    throw new Error("El nutriólogo especificado no existe");
                }
            }
            // verificar si el usuario ya tiene un cliente asociado
            const verifyClient = await Client.findOne({
                where: { user_id: clientData.user_id },
            });
            if (verifyClient) {
                throw new Error("El usuario ya tiene un cliente asociado,\nEntre al perfil y actualice su información");
            }
            // Crear el cliente
            const client = await Client.create({
                user_id: clientData.user_id,
                coach_id: clientData.coach_id,
                nutritionist_id: clientData.nutritionist_id,
                birthDate: clientData.birthDate,
                height: clientData.height,
                diseases: clientData.diseases || [],
                dietaryRestrictions: clientData.dietaryRestrictions || [],
                membershipId: clientData.membershipId,
            });
            return client;
        }
        catch (error) {
            throw new Error(`Error al crear cliente: ${error.message}`);
        }
    }
    async fillClientFields(clientData) {
        try {
            // Verificar si el usuario existe
            const user = await Users.findByPk(clientData.user_id);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            if (user.userType !== UserType.CLIENT) {
                throw new Error("El usuario no es del tipo cliente");
            }
            // verificar si el usuario ya tiene un cliente asociado
            const client = await Client.findOne({
                where: { user_id: clientData.user_id },
            });
            if (!client) {
                throw new Error("El usuario No tiene un cliente asociado");
            }
            // Llenar campos de cliente solo si están presentes en clientData
            if (clientData.birthDate !== undefined) {
                client.birthDate = clientData.birthDate;
            }
            if (clientData.height !== undefined) {
                client.height = clientData.height;
            }
            if (clientData.diseases !== undefined) {
                client.diseases = clientData.diseases;
            }
            if (clientData.dietaryRestrictions !== undefined) {
                client.dietaryRestrictions = clientData.dietaryRestrictions;
            }
            if (clientData.membershipId !== undefined) {
                client.membershipId = clientData.membershipId;
            }
            await client.save();
            return client;
        }
        catch (error) {
            throw new Error(`Error al llenar campos: ${error.message}`);
        }
    }
    async getAllClient() {
        try {
            const client = await Client.findAll({
                include: [
                    {
                        model: Users,
                        as: "user",
                        attributes: ["id", "email", "name", "userType"],
                    },
                ],
            });
            return client.length > 0 ? client : [];
        }
        catch (error) {
            throw new Error(`Error al obtener clientes: ${error.message}`);
        }
    }
    //Obtener cliente por id junto con su usuario, rutinas y dietas
    async getClientById(id) {
        try {
            const client = await Client.findByPk(id, {
                include: [
                    { model: Users, as: "user", attributes: ["id", "name", "email"] },
                    {
                        model: Coach,
                        as: "coach",
                        include: [
                            {
                                model: Users,
                                as: "user",
                                attributes: ["id", "name", "email"],
                            },
                        ],
                    },
                    { model: Routines, as: "routines", attributes: ["id", "name"] },
                    { model: Diets, as: "diets", attributes: ["id", "name"] },
                    { model: Membership, as: "Membership", attributes: ["id", "price"] },
                ],
            });
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            return client;
        }
        catch (error) {
            throw new Error(`Error al obtener el cliente: ${error.message}`);
        }
    }
    async getUserByClientId(clientId) {
        try {
            const client = await Client.findByPk(clientId, {
                include: [{ model: Users, as: "user" }],
            });
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            return client.user || null;
        }
        catch (error) {
            throw new Error(`Error al obtener el usuario del cliente: ${error.message}`);
        }
    }
    // Nuevo método para actualizar parcialmente los datos del cliente
    async updateClient(id, updateData) {
        try {
            const client = await Client.findByPk(id);
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            await client.update(updateData); // Actualización parcial
            return client;
        }
        catch (error) {
            throw new Error(`Error al actualizar el cliente: ${error.message}`);
        }
    }
    async updateClientMembership(userId, idMembership) {
        try {
            // verificar si el usuario es tipo cliente
            const user = await Users.findByPk(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            if (user.userType !== UserType.CLIENT) {
                throw new Error("El usuario no es del tipo cliente");
            }
            // busco el cliente
            const client = await Client.findOne({ where: { user_id: userId } });
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            //verifico que no sea la misma membresía
            if (client.membershipId === idMembership) {
                return client;
            }
            // verifico la membresía
            const membership = await Membership.findByPk(idMembership);
            if (!membership) {
                throw new Error("Membresía no encontrada");
            }
            // actualizo la membresía o la creo si no está
            client.membershipId = idMembership;
            await client.save();
            return client;
        }
        catch (error) {
            throw new Error(`Error al actualizar membresía: ${error.message}`);
        }
    }
    async getfilledFilledByUserId(userId) {
        try {
            const client = await Client.findOne({ where: { user_id: userId } });
            if (client &&
                (client.birthDate === null || client.birthDate === undefined) &&
                (client.height === null || client.height === undefined) &&
                (client.diseases === null || client.diseases.length === 0) &&
                (client.dietaryRestrictions === null || client.dietaryRestrictions.length === 0) &&
                (client.membershipId === null || client.membershipId === undefined)) {
                return false; // los campos están vacíos
            }
            ;
            return true; // Algún campo fué llenado
        }
        catch (error) {
            throw new Error(`Error al obtener el cliente por id de usuario: ${error.message}`);
        }
    }
    async getClientByUserId(userId) {
        try {
            const client = await Client.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: Membership,
                        as: "membership",
                        attributes: ["id", "price"],
                    },
                ],
            });
            return client; // Retorna el cliente o null si no existe
        }
        catch (error) {
            throw new Error(`Error al obtener el cliente por id de usuario: ${error.message}`);
        }
    }
    async getClientWithCoachAndUser(clientId) {
        const client = await Client.findOne({
            where: { id: clientId },
            include: [
                {
                    model: Coach,
                    as: "coach", // Esto accede al coach asociado con el cliente
                    include: [
                        {
                            model: Users, // Aquí se accede al 'user' asociado al coach
                            as: "user",
                            attributes: ["id", "name", "email"],
                        },
                    ],
                },
            ],
        });
        if (!client) {
            throw new Error("Client not found");
        }
        return client;
    }
}
export default new ClientService();

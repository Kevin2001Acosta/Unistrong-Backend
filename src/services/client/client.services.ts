import { ClientInput } from "../../schemas/client/client.input.schema";
import { ClientAttributes } from "../../schemas/client/client.schema";
import Client from "../../db/models/client.models";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";
import Coach from "../../db/models/coach.models";
import Nutritionist from "../../db/models/nutritionist.model";
import Routines from "../../db/models/routines.models";
import Diets from "../../db/models/diets.models";

class ClientService {
  // Método para crear un nuevo cliente
  async createClient(clientData: ClientInput): Promise<ClientAttributes> {
    try {
      // Verificar si el usuario existe
      const user = await Users.findByPk(clientData.user_id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (user.userType !== UserType.CLIENT) {
        throw new Error("El usuario no es del tipo cliente");
      }

      // Verificar si el coach existe (solo si se proporciona un coach_id)
      if (clientData.coach_id) {
        const coach = await Coach.findByPk(clientData.coach_id);
        if (!coach) {
          throw new Error("El coach especificado no existe");
        }
      }

      // Verificar si el nutriólogo existe (solo si se proporciona un nutritionist_id)
      if (clientData.nutritionist_id) {
        const nutritionist = await Nutritionist.findByPk(clientData.nutritionist_id);
        if (!nutritionist) {
          throw new Error("El nutriólogo especificado no existe");
        }
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
      });

      return client;
    } catch (error) {
      throw new Error(`Error al crear cliente: ${(error as Error).message}`);
    }
  }

  // Método para obtener todos los clientes
  async getAllClient(): Promise<ClientAttributes[]> {
    try {
      const clients = await Client.findAll();
      return clients.length > 0 ? clients : [];
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${(error as Error).message}`);
    }
  }

  // Obtener un cliente por id junto con su usuario, rutinas y dietas
  async getClientById(id: number): Promise<ClientAttributes | null> {
    try {
      const client = await Client.findByPk(id, {
        include: [
          { model: Users, as: "user", attributes: ["id", "name", "email"] },
          { model: Routines, as: "routines", attributes: ["id", "name"] },
          { model: Diets, as: "diets", attributes: ["id", "name"] },
        ],
      });
      if (!client) {
        throw new Error("Cliente no encontrado");
      }
      return client;
    } catch (error) {
      throw new Error(`Error al obtener el cliente: ${(error as Error).message}`);
    }
  }

  // Obtener el usuario asociado a un cliente
  async getUserByClientId(clientId: number): Promise<Users | null> {
    try {
      const client = await Client.findByPk(clientId, {
        include: [{ model: Users, as: "user" }],
      });

      if (!client) {
        throw new Error("Cliente no encontrado");
      }
      return client.user || null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario del cliente: ${(error as Error).message}`
      );
    }
  }

  // Método para actualizar parcialmente los datos de un cliente
  async updateClient(id: number, updateData: Partial<ClientInput>): Promise<Client | null> {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error("Cliente no encontrado");
      }

      // Actualizar los datos del cliente
      await client.update(updateData);

      // Devolver el cliente actualizado
      return client;
    } catch (error) {
      throw new Error(`Error al actualizar el cliente: ${(error as Error).message}`);
    }
  }
}

export default new ClientService();

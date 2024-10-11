import { ClientInput } from "../../schemas/client/client.input.schema";
import { ClientAttributes } from "../../schemas/client/client.schema";
import Client from "../../db/models/client.models";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";

class ClientService {
  async createClient(clientData: ClientInput): Promise<ClientAttributes> {
    try {
      const user = await Users.findByPk(clientData.user_id);
      console.log("cliente:", clientData);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      if (user.user_type === UserType.CLIENT) {
        await user.save();
      } else {
        throw new Error("Usuario no es cliente");
      }

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

  async getAllClient(): Promise<ClientAttributes[]> {
    try {
      const client = await Client.findAll();
      return client.length > 0 ? client : [];
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${(error as Error).message}`);
    }
  }

  async getClientById(id: number): Promise<ClientAttributes | null> {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error("Cliente no encontrado");
      }
      return client;
    } catch (error) {
      throw new Error(
        `Error al obtener el cliente: ${(error as Error).message}`
      );
    }
  }

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
}

export default new ClientService();

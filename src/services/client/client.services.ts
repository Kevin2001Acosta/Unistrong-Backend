import { ClientInput } from "../../schemas/client/client.input.schema";
import { ClientAttributes } from "../../schemas/client/client.schema";
import Client from "../../models/client.models";
import Users from "../../models/user.model";

class ClientService {
  async createClient(clientData: ClientInput): Promise<ClientAttributes> {
    try {
      console.log("cliente:", clientData);
      const client = await Client.create(clientData);
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
        include: [{ model: Users, as: "user" }], // Incluir el modelo Users con el alias 'user'
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

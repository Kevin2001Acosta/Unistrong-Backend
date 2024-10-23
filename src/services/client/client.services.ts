import { ClientInput } from "../../schemas/client/client.input.schema";
import { ClientAttributes } from "../../schemas/client/client.schema";
import Client from "../../models/client.models";
import Users from "../../models/user.model";
import { UserType } from "../../models/utils/user.types";
import Coach from "../../models/coach.models";
import Nutritionist from "../../models/nutritionist.model";
import Routines from "../../models/routines.models";
import Diets from "../../models/diets.models";

class ClientService {
  async createClient(clientData: ClientInput): Promise<ClientAttributes> {
    try {
      // Verificar si el usuario existe
      const user = await Users.findByPk(clientData.user_id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (user.user_type !== UserType.CLIENT) {
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
        const nutritionist = await Nutritionist.findByPk(
          clientData.nutritionist_id
        );
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

  async getAllClient(): Promise<ClientAttributes[]> {
    try {
      const client = await Client.findAll();
      return client.length > 0 ? client : [];
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${(error as Error).message}`);
    }
  }
  //Obtener cliente por id junto con su usuario, rutinas y dietas
  async getClientById(id: number): Promise<ClientAttributes | null> {
    try {
      const client = await Client.findByPk(id, {
        include: [
          { model: Users, as: "user" },
          { model: Routines, as: "routines" },
          { model: Diets, as: "diets" },
        ],
      });
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

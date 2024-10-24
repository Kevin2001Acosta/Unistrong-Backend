import Client from "../../models/client.models";
import { DietsInput } from "../../schemas/diets/diets.input.schema";
import { DietsAtributes } from "../../schemas/diets/diets.schema";
import Nutritionist from "../../models/nutritionist.model";
import Diets from "../../models/diets.models";
import { assignDietsInput } from "../../schemas/diets/assign.diets.input";
import ClientDiets from "../../models/client_diets.models";

class DietsService {
  async createDiet(dietData: DietsInput): Promise<DietsAtributes> {
    try {
      const nutri = await Nutritionist.findByPk(dietData.nutritionistId);
      if (!nutri) {
        throw new Error("Nutriologo no encontrado");
      }
      const diet = await Diets.create(dietData);
      return diet;
    } catch (error) {
      throw new Error(`Error al crear la dieta: ${(error as Error).message}`);
    }
  }

  // Obtener todas las dietas con sus clientes asignados
  async getAllDiets(): Promise<DietsAtributes[]> {
    try {
      const diets = await Diets.findAll({
        include: [
          {
            model: Client,
            as: "clients",
          },
        ],
      });
      return diets.length > 0 ? diets : [];
    } catch (error) {
      throw new Error(
        `Error al obtener las dietas: ${(error as Error).message}`
      );
    }
  }
  async assignDietToClient(data: assignDietsInput): Promise<void> {
    const { clientId, dietId } = data;
    try {
      // Verificar si el cliente y la dieta existen
      const clientExists = await Client.findByPk(clientId);
      if (!clientExists) {
        throw new Error("El cliente especificado no existe.");
      }
      const dietExists = await Diets.findByPk(dietId);
      if (!dietExists) {
        throw new Error("La rutina especificada no existe.");
      }
      // Asignar la dieta al cliente en la tabla intermedia
      await ClientDiets.create({ clientId, dietId });
    } catch (error) {
      throw new Error(`Error al asignar la dieta: ${(error as Error).message}`);
    }
  }
}

export default new DietsService();

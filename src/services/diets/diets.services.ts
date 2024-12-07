import Client from "../../db/models/client.models";
import { DietsInput } from "../../schemas/diets/diets.input.schema";
import { DietsAtributes } from "../../schemas/diets/diets.schema";
import Nutritionist from "../../db/models/nutritionist.model";
import Diets from "../../db/models/diets.models";
import { assignDietsInput } from "../../schemas/diets/assign.diets.input";
import ClientDiets from "../../db/models/client_diets.models";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";

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

  async getAllDiets(): Promise<DietsAtributes[]> {
    try {
      const diets = await Diets.findAll({
        include: [
          {
            model: Client,
            as: "clients",
            attributes: ["id", "user_id"],
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

  async assignDietByEmail(email: string, dietId: number): Promise<void> {
    try {
      // Buscar el usuario por email
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      if (user.userType !== UserType.CLIENT) {
        throw new Error("El usuario especificado no es un cliente.");
      }

      // Buscar el cliente asociado al usuario
      const client = await Client.findOne({ where: { user_id: user.id } });
      if (!client) {
        throw new Error("Cliente no encontrado.");
      }

      // Verificar si la rutina existe
      const diet = await Diets.findByPk(dietId);
      if (!diet) {
        throw new Error("Dieta no encontrada.");
      }
      await ClientDiets.create({ clientId: client.id, dietId });

      client.nutritionist_id = diet.nutritionistId;
      await client.save();
    } catch (error) {
      throw new Error(
        `Error al asignar la rutina: ${(error as Error).message}`
      );
    }
  }

  async getDietsByNutritionist(nutritionistId: number): Promise<Diets[]> {
    if (!nutritionistId || isNaN(nutritionistId)) {
      throw new Error("ID de nutriólogo inválido.");
    }

    const diets = await Diets.findAll({
      where: { nutritionistId },
    });

    if (diets.length === 0) {
      throw new Error("No se encontraron dietas para este nutriólogo.");
    }

    return diets;
  }

  async getDietsByClient(clientId: number) {
    if (!clientId || isNaN(clientId)) {
      throw new Error("ID de cliente inválido.");
    }

    // Buscar todas las dietas asociadas al cliente en la tabla intermedia ClientDiets
    const clientDiets = await ClientDiets.findAll({
      where: { clientId },
      include: [
        {
          model: Diets,
          as: "diet", // Alias 'diet' definido en la relación
          attributes: ["id", "name", "description", "type"], // Solo traer los atributos necesarios
        },
      ],
    });

    if (clientDiets.length === 0) {
      throw new Error("No se encontraron dietas asignadas para este cliente.");
    }

    // Extraer las dietas desde la relación con ClientDiets
    return clientDiets.map((clientDiet) => clientDiet.diet); // Aquí accedemos a la propiedad 'diet'
  }
}
export default new DietsService();

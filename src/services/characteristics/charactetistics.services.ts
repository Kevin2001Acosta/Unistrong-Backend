import ClientCharacteristics from "../../db/models/client.characteristics.models";
import { ClientCharacteristicsInput } from "../../schemas/ClientCharacteristics/client.characteristics.input.schema";
import { ClientCharacteristicsAttributes } from "../../schemas/ClientCharacteristics/client.characteristics.schema";
import Client from "../../db/models/client.models";

class CharacteristicsServices {
  // Crear características
  async createCharacteristics(
    characteristicsData: ClientCharacteristicsInput
  ): Promise<ClientCharacteristicsAttributes | null> {
    try {
      const client = await Client.findByPk(characteristicsData.clientId);
      if (!client) {
        throw new Error("Cliente no encontrado");
      }

      // Crear las características
      const characteristics = await ClientCharacteristics.create({
        clientId: characteristicsData.clientId,
        weight: characteristicsData.weight,
        height: characteristicsData.height,
        waist: characteristicsData.waist,
        legs: characteristicsData.legs,
        arms: characteristicsData.arms,
        chest: characteristicsData.chest,
        glutes: characteristicsData.glutes,
      });

      if (!characteristics) {
        return null;
      }
      return characteristics;
    } catch (error) {
      throw new Error(
        `Error al crear las características: ${(error as Error).message}`
      );
    }
  }

  async getCharacteristics(): Promise<ClientCharacteristicsAttributes[]> {
    try {
      const characteristics = await ClientCharacteristics.findAll();
      if (characteristics.length === 0) {
        throw new Error("No se encontraron características");
      }
      return characteristics;
    } catch (error) {
      throw new Error(
        `Error al obtener las características: ${(error as Error).message}`
      );
    }
  }

  async getCharacteristicsByClientId(
    clientId: number
  ): Promise<ClientCharacteristicsAttributes> {
    try {
      const characteristics = await ClientCharacteristics.findOne({
        where: { clientId },
        include: [{ model: Client, as: "client" }],
      });

      if (!characteristics) {
        throw new Error("Características no encontradas para este cliente");
      }

      return characteristics;
    } catch (error) {
      throw new Error(
        `Error al obtener las características: ${(error as Error).message}`
      );
    }
  }
}

export default new CharacteristicsServices();

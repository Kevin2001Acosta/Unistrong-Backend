import { NutritionistAtributes } from "../../schemas/nutritionist/nutritionist.schema";
import { NutritionistInput } from "../../schemas/nutritionist/nutritionist.input.schema";
import Nutritionist from "../../db/models/nutritionist.model";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";

class NutritionistService {
  async createNutritionist(
    nutritionistData: NutritionistInput
  ): Promise<NutritionistAtributes> {
    try {
      const user = await Users.findByPk(nutritionistData.user_id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      user.userType = UserType.NUTRITIONIST;
      await user.save();
      const nutri = await Nutritionist.create({
        user_id: nutritionistData.user_id,
      });
      return nutri;
    } catch (error) {
      throw new Error(`Error al crear nutriologo: ${(error as Error).message}`);
    }
  }

  //Obtener nutriologo con su informacion de usuario
  async getAllNutritionist(): Promise<any[]> {
    try {
      const nutri = await Nutritionist.findAll({
        attributes: ["id", "user_id"],
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["username", "email", "name", "dni", "phone_number", "state"],
          },
        ],
      });
      return nutri.length > 0 ? nutri : [];
    } catch (error) {
      throw new Error(
        `Error al obtener todos los nutriologos: ${(error as Error).message}`
      );
    }
  }
}

export default new NutritionistService();

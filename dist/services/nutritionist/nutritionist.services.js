import Nutritionist from "../../db/models/nutritionist.model";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";
class NutritionistService {
    async createNutritionist(nutritionistData) {
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
        }
        catch (error) {
            throw new Error(`Error al crear nutriologo: ${error.message}`);
        }
    }
    async getAllNutritionist() {
        try {
            const nutri = await Nutritionist.findAll({
                include: [
                    {
                        model: Users,
                        as: "user",
                        attributes: ["id", "name", "email"],
                    },
                ],
            });
            return nutri.length > 0 ? nutri : [];
        }
        catch (error) {
            throw new Error(`Error al obtener todos los nutriologos: ${error.message}`);
        }
    }
}
export default new NutritionistService();

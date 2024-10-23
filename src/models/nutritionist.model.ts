import { NutritionistInput } from "../schemas/nutritionist/nutritionist.input.schema";
import { NutritionistAtributes } from "../schemas/nutritionist/nutritionist.schema";
import { sequelize } from "../db/config/config.db";
import { Model, DataTypes } from "sequelize";

class Nutritionist
  extends Model<NutritionistAtributes, NutritionistInput>
  implements NutritionistAtributes
{
  public id!: number;
  public user_id!: number;
}

Nutritionist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "nutritionists",
  }
);

export default Nutritionist;

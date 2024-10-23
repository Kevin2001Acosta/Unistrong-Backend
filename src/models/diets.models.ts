//modelos que representan la entidad
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config/config.db";
import Nutritionist from "./nutritionist.model";
import { DietsAtributes } from "../schemas/diets/diets.schema";
import { DietsInput } from "../schemas/diets/diets.input.schema";

class Diets
  extends Model<DietsAtributes, DietsInput>
  implements DietsAtributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public type!: string;
  public nutritionistId!: number;
}

Diets.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nutritionistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Nutritionist,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "diets",
  }
);

export default Diets;

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config/config.db";
import { CoachAtributes } from "../schemas/coach/coach.schemas";
import { CoachInput } from "../schemas/coach/coach.input.schemas";

class Coach
  extends Model<CoachAtributes, CoachInput>
  implements CoachAtributes
{
  declare id: number;
  declare dni: string;
}

Coach.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },

  {
    sequelize,
    tableName: "coaches",
  }
);

export default Coach;

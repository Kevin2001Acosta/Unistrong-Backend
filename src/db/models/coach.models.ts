import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { CoachAtributes } from "../../schemas/coach/coach.schemas";
import { CoachInput } from "../../schemas/coach/coach.input.schemas";
import { RoutinesAttributes } from "../../schemas/routines/routines.schema";

class Coach
  extends Model<CoachAtributes, CoachInput>
  implements CoachAtributes
{
  public id!: number;
  public user_id!: number;
  public routines?: RoutinesAttributes[];
}

Coach.init(
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
    tableName: "coaches",
  }
);

export default Coach;

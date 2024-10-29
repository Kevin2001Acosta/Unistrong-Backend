//modelos que representan la entidad
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Coach from "./coach.models";
import { RoutinesAttributes } from "../../schemas/routines/routines.schema";
import { RoutinesInput } from "../../schemas/routines/routines.input.schema";

class Routines
  extends Model<RoutinesAttributes, RoutinesInput>
  implements RoutinesAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: string;
  public musclesWorked!: string[];
  public coachId!: number;
}

Routines.init(
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    musclesWorked: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Coach,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "routines",
  }
);

export default Routines;

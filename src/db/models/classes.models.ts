import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Coach from "./coach.models";
import { ClassesAtributes } from "../../schemas/classes/classes.schema";
import { ClassesInput } from "../../schemas/classes/classes.input.schema";

class Classes
  extends Model<ClassesAtributes, ClassesInput>
  implements ClassesAtributes
{
  public id!: number;
  public name!: string;
  public coachId!: number;
  public startTime!: Date;
  public finishTime!: Date;
  public duration!: number;
  public type!: string;
  public active!: boolean;
}

Classes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Coach,
        key: "id",
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    finishTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "classes",
    sequelize,
  }
);

export default Classes;

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { ClientAttributes } from "../../schemas/client/client.schema";
import { ClientInput } from "../../schemas/client/client.input.schema";
import { UserState } from "./utils/user.state";
import Coach from "./coach.models";
import Users from "./user.model";

class Client
  extends Model<ClientAttributes, ClientInput>
  implements ClientAttributes
{
  public id!: number;
  public userId!: number;
  public coachId!: number;
  public birthDate!: Date;
  public nutritionistId!: number;
  public height!: number;
  public state!: UserState;
  public diseases!: string[];
  public dietaryRestrictions!: string[];
  public user?: Users;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    //campo de llave foranea
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    //campo de llave foranea
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Coach,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    //campo de llave foranea
    nutritionistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    diseases: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    dietaryRestrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "clients",
  }
);

export default Client;

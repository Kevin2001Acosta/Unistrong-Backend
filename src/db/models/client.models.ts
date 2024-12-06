import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { ClientAttributes } from "../../schemas/client/client.schema";
import { ClientInput } from "../../schemas/client/client.input.schema";
import { UserState } from "./utils/user.state";
import Coach from "./coach.models";
import Users from "./user.model";
import Nutritionist from "./nutritionist.model";
import Routines from "./routines.models";
import Membership from "./membership.models";

class Client
  extends Model<ClientAttributes, ClientInput>
  implements ClientAttributes
{
  public id!: number;
  public user_id!: number;
  public coach_id!: number;
  public birthDate!: Date;
  public nutritionist_id!: number;
  public height!: number;
  public state!: UserState;
  public diseases!: string[];
  public dietaryRestrictions!: string[];
  public routines?: Routines[];
  public user?: Users;
  public membershipId?: number;
  public membership?: Membership;
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users, // Relacionar con la tabla de Users
        key: "id",
      },
      onDelete: "CASCADE",
    },
    //campo de llave foranea
    coach_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Coach,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    //campo de llave foranea
    nutritionist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Nutritionist,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    diseases: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    dietaryRestrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    membershipId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permitir que sea NULL
      references: {
        model: Membership,
        key: "id",
      },
      onDelete: "SET NULL", // Establecer en NULL en lugar de eliminar
    },
  },
  {
    sequelize,
    tableName: "clients",
  }
);

export default Client;

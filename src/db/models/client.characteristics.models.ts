import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/config.db";
import { ClientCharacteristicsAttributes } from "../../schemas/ClientCharacteristics/client.characteristics.schema";
import { ClientCharacteristicsInput } from "../../schemas/ClientCharacteristics/client.characteristics.input.schema";
import Client from "./client.models";

class ClientCharacteristics
  extends Model<ClientCharacteristicsAttributes, ClientCharacteristicsInput>
  implements ClientCharacteristicsAttributes
{
  public id!: number;
  public clientId!: number;
  public weight?: number;
  public height?: number;
  public waist?: number;
  public legs?: number;
  public arms?: number;
  public chest?: number;
  public glutes?: number;
}

ClientCharacteristics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    waist: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    legs: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    arms: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    chest: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    glutes: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "client_characteristics",
  }
);

export default ClientCharacteristics;

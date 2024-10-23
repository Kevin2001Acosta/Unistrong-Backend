import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config/config.db";
import Client from "../models/client.models";
import Diets from "../models/diets.models";

class ClientDiets extends Model {
  public clientId!: number;
  public dietId!: number;
}

ClientDiets.init(
  {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    dietId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Diets,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, modelName: "client_diets" }
);

export default ClientDiets;

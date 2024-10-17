import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Client from "../models/client.models";
import Diets from "../models/diets.models";

class ClientDiets extends Model {
  public clientId!: number;
  public routineId!: number;
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
    routineId: {
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

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";

import Client from "./client.models";
import Routines from "./routines.models";
import { assignRoutineInput } from "../../schemas/routines/assign.routines.input";

class ClientRoutines
  extends Model<assignRoutineInput>
  implements assignRoutineInput
{
  public clientId!: number;
  public routineId!: number;
}

ClientRoutines.init(
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
        model: Routines,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, modelName: "client_routines" }
);

export default ClientRoutines;

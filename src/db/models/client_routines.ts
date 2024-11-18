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
  public scheduledDate!: Date;
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
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false, // Hacemos que este campo sea obligatorio
    },
  },
  { sequelize, modelName: "client_routines", timestamps: false }
);

export default ClientRoutines;

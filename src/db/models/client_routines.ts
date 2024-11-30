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
  public scheduledDate?: Date;
  public recurrenceDay?: number; // Día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  public time?: string; // Hora en formato HH:mm
  public recurrentDates?: string[]; // Nuevas fechas recurrentes
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
      allowNull: true,
    },
    recurrenceDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recurrentDates: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  { sequelize, modelName: "client_routines", timestamps: false }
);

export default ClientRoutines;

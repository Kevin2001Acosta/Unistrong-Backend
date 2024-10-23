import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Client from "../models/client.models";
import Classes from "../models/classes.models";
import { ReservationsAtributes } from "../../schemas/classes/reservations.schema";
import { ReservationsInput } from "../../schemas/classes/reservations.input.schema";

class Reservations
  extends Model<ReservationsAtributes, ReservationsInput>
  implements ReservationsAtributes
{
  public id!: number;
  public clientId!: number;
  public classId!: number;
}

Reservations.init(
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
      onDelete: "CASCADE",
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Classes,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, modelName: "reservations" }
);

export default Reservations;

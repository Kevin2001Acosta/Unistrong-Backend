import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Client from "./client.models";
import Routines from "./routines.models";
class ClientRoutines extends Model {
    clientId;
    routineId;
    scheduledDate;
    recurrenceDay; // Día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    time; // Hora en formato HH:mm
    recurrentDates; // Nuevas fechas recurrentes
}
ClientRoutines.init({
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
}, { sequelize, modelName: "client_routines", timestamps: false });
export default ClientRoutines;

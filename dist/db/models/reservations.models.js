import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Client from "./client.models";
import Classes from "./classes.models";
class Reservations extends Model {
    id;
    clientId;
    classId;
}
Reservations.init({
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
}, { sequelize, modelName: "reservations" });
export default Reservations;

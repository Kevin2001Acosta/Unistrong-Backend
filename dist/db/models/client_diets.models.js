import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Client from "./client.models";
import Diets from "./diets.models";
class ClientDiets extends Model {
    clientId;
    dietId;
    client; // Relación con Client
    diet; // Relación con Diets
}
ClientDiets.init({
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
}, { sequelize, modelName: "client_diets" });
export default ClientDiets;

import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Client from "./client.models";
class ClientCharacteristics extends Model {
    id;
    clientId;
    weight;
    height;
    waist;
    legs;
    arms;
    chest;
    glutes;
}
ClientCharacteristics.init({
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
        allowNull: false,
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    waist: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    legs: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    arms: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    chest: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    glutes: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "client_characteristics",
});
export default ClientCharacteristics;

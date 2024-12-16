"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const client_models_1 = __importDefault(require("./client.models"));
class ClientCharacteristics extends sequelize_1.Model {
}
ClientCharacteristics.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    clientId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: client_models_1.default,
            key: "id",
        },
    },
    weight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    height: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    waist: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    legs: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    arms: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    chest: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    glutes: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: config_db_1.sequelize,
    modelName: "client_characteristics",
});
exports.default = ClientCharacteristics;

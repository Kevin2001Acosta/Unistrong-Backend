"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const client_models_1 = __importDefault(require("./client.models"));
const diets_models_1 = __importDefault(require("./diets.models"));
class ClientDiets extends sequelize_1.Model {
}
ClientDiets.init({
    clientId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: client_models_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    dietId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: diets_models_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, { sequelize: config_db_1.sequelize, modelName: "client_diets" });
exports.default = ClientDiets;

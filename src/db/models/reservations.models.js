"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const client_models_1 = __importDefault(require("./client.models"));
const classes_models_1 = __importDefault(require("./classes.models"));
class Reservations extends sequelize_1.Model {
}
Reservations.init({
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
        onDelete: "CASCADE",
    },
    classId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: classes_models_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, { sequelize: config_db_1.sequelize, modelName: "reservations" });
exports.default = Reservations;

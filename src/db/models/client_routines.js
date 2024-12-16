"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const client_models_1 = __importDefault(require("./client.models"));
const routines_models_1 = __importDefault(require("./routines.models"));
class ClientRoutines extends sequelize_1.Model {
}
ClientRoutines.init({
    clientId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: client_models_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    routineId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: routines_models_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    scheduledDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    recurrenceDay: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    time: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    recurrentDates: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
}, { sequelize: config_db_1.sequelize, modelName: "client_routines", timestamps: false });
exports.default = ClientRoutines;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const coach_models_1 = __importDefault(require("./coach.models"));
class Classes extends sequelize_1.Model {
}
Classes.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    coachId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: coach_models_1.default,
            key: "id",
        },
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    finishTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: "classes",
    sequelize: config_db_1.sequelize,
});
exports.default = Classes;

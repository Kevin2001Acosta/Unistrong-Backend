"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//modelos que representan la entidad
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const coach_models_1 = __importDefault(require("./coach.models"));
class Routines extends sequelize_1.Model {
}
Routines.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    musclesWorked: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
    },
    coachId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: coach_models_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    sequelize: config_db_1.sequelize,
    tableName: "routines",
});
exports.default = Routines;

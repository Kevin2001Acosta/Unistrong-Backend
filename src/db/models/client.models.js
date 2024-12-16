"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const coach_models_1 = __importDefault(require("./coach.models"));
const user_model_1 = __importDefault(require("./user.model"));
const nutritionist_model_1 = __importDefault(require("./nutritionist.model"));
const membership_models_1 = __importDefault(require("./membership.models"));
class Client extends sequelize_1.Model {
}
Client.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    //campo de llave foranea
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_model_1.default, // Relacionar con la tabla de Users
            key: "id",
        },
        onDelete: "CASCADE",
    },
    //campo de llave foranea
    coach_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: coach_models_1.default,
            key: "id",
        },
        onDelete: "SET NULL",
    },
    //campo de llave foranea
    nutritionist_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: nutritionist_model_1.default,
            key: "id",
        },
        onDelete: "SET NULL",
    },
    birthDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    height: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    diseases: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    dietaryRestrictions: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    membershipId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true, // Permitir que sea NULL
        references: {
            model: membership_models_1.default,
            key: "id",
        },
        onDelete: "SET NULL", // Establecer en NULL en lugar de eliminar
    },
}, {
    sequelize: config_db_1.sequelize,
    tableName: "clients",
});
exports.default = Client;

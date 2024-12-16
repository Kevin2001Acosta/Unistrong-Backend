"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
class Accountant extends sequelize_1.Model {
}
Accountant.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: config_db_1.sequelize,
    tableName: "accountants",
});
exports.default = Accountant;
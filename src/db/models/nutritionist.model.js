"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_db_1 = require("../config/config.db");
const sequelize_1 = require("sequelize");
class Nutritionist extends sequelize_1.Model {
}
Nutritionist.init({
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
    tableName: "nutritionists",
});
exports.default = Nutritionist;

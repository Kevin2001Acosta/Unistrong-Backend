"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db"); // Adjust the path as necessary
class Membership extends sequelize_1.Model {
}
Membership.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: config_db_1.sequelize,
    tableName: 'memberships',
    timestamps: false,
});
exports.default = Membership;

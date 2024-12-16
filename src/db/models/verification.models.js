"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const verification_type_1 = require("./utils/verification.type");
class Verification extends sequelize_1.Model {
}
Verification.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    code: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    expiration_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: [verification_type_1.VerificationType.Password, verification_type_1.VerificationType.Email],
        allowNull: false,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: config_db_1.sequelize,
    tableName: 'verification',
});
exports.default = Verification;

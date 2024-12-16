"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_db_1 = require("../config/config.db");
const constraints_1 = require("./utils/constraints");
const user_types_1 = require("./utils/user.types");
class Users extends sequelize_1.Model {
}
Users.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: {
            name: "users_email_key",
            msg: "El correo electrónico ya está registrado",
        },
        validate: {
            isEmail: {
                msg: "Debe ser un correo electrónico válido",
            },
        },
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [4, 255],
                msg: "El nombre de usuario debe tener al menos 4 caracteres",
            },
        },
    },
    dni: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: {
            name: "users_dni_key",
            msg: "El DNI ya está registrado",
        },
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: {
            name: "users_username_key",
            msg: "El nombre de usuario ya está en uso",
        },
        validate: {
            len: {
                args: [4, 255],
                msg: "El nombre de usuario debe tener al menos 4 caracteres",
            },
            isValidUsername: constraints_1.isValidUsername,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isStrongPassword: constraints_1.isStrongPassword,
        },
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: {
                msg: "El número de teléfono solo debe contener dígitos",
            },
        },
    },
    state: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
    userType: {
        type: sequelize_1.DataTypes.ENUM(user_types_1.UserType.ADMIN, user_types_1.UserType.CLIENT, user_types_1.UserType.COACH, user_types_1.UserType.NUTRITIONIST, user_types_1.UserType.ACCOUNTANT),
        allowNull: false,
        defaultValue: user_types_1.UserType.CLIENT,
    },
}, {
    sequelize: config_db_1.sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ["email"],
        },
    ],
});
exports.default = Users;

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { UserAtributes } from "../../schemas/user/user.schema";
import { UserInput } from "../../schemas/user/user.input.schema";
import { isValidUsername, isStrongPassword } from "./utils/constraints";
import { UserType } from "./utils/user.types";

class Users extends Model<UserAtributes, UserInput> implements UserAtributes {
  declare id: number;
  declare email: string;
  declare name: string;
  declare dni: string;
  declare username: string;
  declare password: string;
  declare phoneNumber: string;
  declare state: boolean;
  declare userType: UserType;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 255],
          msg: "El nombre de usuario debe tener al menos 4 caracteres",
        },
      },
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "users_dni_key",
        msg: "El DNI ya está registrado",
      },
    },
    username: {
      type: DataTypes.STRING,
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
        isValidUsername,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isStrongPassword,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: "El número de teléfono solo debe contener dígitos",
        },
      },
    },
    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    userType: {
      type: DataTypes.ENUM(
        UserType.ADMIN,
        UserType.CLIENT,
        UserType.COACH,
        UserType.NUTRITIONIST,
        UserType.ACCOUNTANT
      ),
      allowNull: false,
      defaultValue: UserType.CLIENT,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
  }
);

export default Users;

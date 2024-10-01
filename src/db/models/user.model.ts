//modelos que representan la entidad
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { UserAtributes } from "../../schemas/user/user.schema";
import { UserInput } from "../../schemas/user/user.input.schema";
class Users extends Model<UserAtributes, UserInput> implements UserAtributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public dni!: string;
  public username!: string;
  public password!: string;
  public phoneNumber!: string; // Corregido: 'String' a 'string'
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
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

export default Users;

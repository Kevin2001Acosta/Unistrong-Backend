//modelos que representan la entidad
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { UserAtributes } from "../../schemas/user/user.schema";
import { UserInput } from "../../schemas/user/user.input.schema";
import { UserType } from "./utils/user.types";
import { UserState } from "./utils/user.state";

class Users extends Model<UserAtributes, UserInput> implements UserAtributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public type!: UserType;
  public dni!: string;
  public username!: string;
  public password!: string;
  public state!: UserState;
  public phoneNumber!: String;
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
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(UserType)),
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
    state: {
      type: DataTypes.ENUM(...Object.values(UserState)),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default Users;

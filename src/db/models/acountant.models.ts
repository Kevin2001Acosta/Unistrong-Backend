import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { AccountantAttributes } from "../../schemas/accountant/accountant.schema";
import { AccountantInput } from "../../schemas/accountant/accountant.input";

class Accountant
  extends Model<AccountantAttributes, AccountantInput>
  implements AccountantAttributes
{
  public id!: number;
  public user_id!: number;
}

Accountant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },

  {
    sequelize,
    tableName: "accountants",
  }
);

export default Accountant;

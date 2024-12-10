import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
class Accountant extends Model {
    id;
    user_id;
}
Accountant.init({
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
}, {
    sequelize,
    tableName: "accountants",
});
export default Accountant;

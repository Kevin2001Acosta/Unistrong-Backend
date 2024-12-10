import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
class Admin extends Model {
    id;
    user_id;
}
Admin.init({
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
    tableName: "admin",
});
export default Admin;

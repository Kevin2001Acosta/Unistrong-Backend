import { sequelize } from "../config/config.db";
import { Model } from "sequelize";
class Nutritionist extends Model {
    id;
    user_id;
}
Nutritionist.init({
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
    tableName: "nutritionists",
});
export default Nutritionist;

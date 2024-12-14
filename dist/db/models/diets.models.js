//modelos que representan la entidad
import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Nutritionist from "./nutritionist.model";
class Diets extends Model {
    id;
    name;
    description;
    type;
    nutritionistId;
}
Diets.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nutritionistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Nutritionist,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    sequelize,
    tableName: "diets",
});
export default Diets;

//modelos que representan la entidad
import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Coach from "./coach.models";
class Routines extends Model {
    id;
    name;
    description;
    category;
    musclesWorked;
    coachId;
}
Routines.init({
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
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    musclesWorked: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    coachId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Coach,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    sequelize,
    tableName: "routines",
});
export default Routines;

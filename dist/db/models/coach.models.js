import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
class Coach extends Model {
    id;
    user_id;
    routines;
}
Coach.init({
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
    tableName: "coaches",
});
export default Coach;

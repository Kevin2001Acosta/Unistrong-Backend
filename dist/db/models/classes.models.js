import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Coach from "./coach.models";
class Classes extends Model {
    id;
    name;
    coachId;
    startTime;
    finishTime;
    duration;
    type;
    active;
}
Classes.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    coachId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Coach,
            key: "id",
        },
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    finishTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: "classes",
    sequelize,
});
export default Classes;

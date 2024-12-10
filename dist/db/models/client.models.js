import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Coach from "./coach.models";
import Users from "./user.model";
import Nutritionist from "./nutritionist.model";
import Membership from "./membership.models";
class Client extends Model {
    id;
    user_id;
    coach_id;
    birthDate;
    nutritionist_id;
    height;
    state;
    diseases;
    dietaryRestrictions;
    routines;
    user;
    membershipId;
    membership;
}
Client.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    //campo de llave foranea
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users, // Relacionar con la tabla de Users
            key: "id",
        },
        onDelete: "CASCADE",
    },
    //campo de llave foranea
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Coach,
            key: "id",
        },
        onDelete: "SET NULL",
    },
    //campo de llave foranea
    nutritionist_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Nutritionist,
            key: "id",
        },
        onDelete: "SET NULL",
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    height: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    diseases: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    dietaryRestrictions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    membershipId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permitir que sea NULL
        references: {
            model: Membership,
            key: "id",
        },
        onDelete: "SET NULL", // Establecer en NULL en lugar de eliminar
    },
}, {
    sequelize,
    tableName: "clients",
});
export default Client;

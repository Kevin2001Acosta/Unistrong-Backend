import { Model } from "sequelize";
import { sequelize } from "../config/config.db";
import Client from "./client.models";
class MembershipPayment extends Model {
}
MembershipPayment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'id',
        },
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize,
    tableName: 'MembershipPayment',
});
export default MembershipPayment;

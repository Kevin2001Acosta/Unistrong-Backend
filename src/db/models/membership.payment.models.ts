import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { MembershipPaymentAttributes, MembershipPaymentInput } from "../../schemas/membership/membershipPayment.schema";
import Client from "./client.models";


class MembershipPayment 
extends Model<MembershipPaymentAttributes, MembershipPaymentInput> 
implements MembershipPaymentAttributes
{
    declare id: number;
    declare clientId: number;
    declare startDate: Date;
    declare endDate: Date;
    declare amount: number;
    declare active: boolean;
}

MembershipPayment.init(
    {
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

    },
    {
        sequelize,
        tableName: 'MembershipPayment',
    }
)

export default MembershipPayment;
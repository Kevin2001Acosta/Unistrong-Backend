import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { MembershipAttributes, MembershipInput } from "../../schemas/membership/membership.schema";
import Client from "./client.models";


class Membership 
extends Model<MembershipAttributes, MembershipInput> 
implements MembershipAttributes
{
    declare id: number;
    declare clientId: number;
    declare startDate: Date;
    declare endDate: Date;
    declare price: number;
    declare active: boolean;
}

Membership.init(
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
        price: {
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
        tableName: 'memberships',
    }
)

export default Membership;
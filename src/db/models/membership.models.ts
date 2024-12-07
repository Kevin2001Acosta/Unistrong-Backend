import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/config.db'; // Adjust the path as necessary
import { MembershipAttributes } from '../../schemas/membership/membership.schema';
class Membership extends Model<MembershipAttributes> {
    declare id: number;
    declare price: number;
}

Membership.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'memberships',
        timestamps: false,
    }
);

export default Membership;
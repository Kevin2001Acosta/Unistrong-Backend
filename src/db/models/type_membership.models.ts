import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/config.db'; // Adjust the path as necessary
import { TypeMembershipAttributes } from '../../schemas/membership/typeMembership.schema';
class TypeMembership extends Model<TypeMembershipAttributes> {
    declare id: number;
    declare price: number;
}

TypeMembership.init(
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
        modelName: 'TypeMembership',
        tableName: 'type_memberships',
        timestamps: false,
    }
);

export default TypeMembership;
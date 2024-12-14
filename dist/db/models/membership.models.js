import { Model } from 'sequelize';
import { sequelize } from '../config/config.db'; // Adjust the path as necessary
class Membership extends Model {
}
Membership.init({
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
}, {
    sequelize,
    tableName: 'memberships',
    timestamps: false,
});
export default Membership;

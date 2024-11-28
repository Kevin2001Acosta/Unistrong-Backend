import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/config.db";
import { VerificationAttributes, VerificationInput } from "../../schemas/verification/verification.schema";
import { VerificationType } from "./utils/verification.type";


class Verification 
extends Model<VerificationAttributes, VerificationInput> 
implements VerificationAttributes
{
    declare id: bigint;
    declare userId: bigint;
    declare code: string;
    declare expiration_date: Date;
    declare type: VerificationType;
    declare verified: boolean;
    declare active: boolean;
}

Verification.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        code: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        expiration_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM,
            values: [VerificationType.Password, VerificationType.Email],
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

    },
    {
        sequelize,
        tableName: 'verification',
    }
)

export default Verification;
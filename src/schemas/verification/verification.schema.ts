import { VerificationType } from '../../db/models/utils/verification.type';

export interface VerificationAttributes {
    id: bigint;
    userId: bigint;
    code: string; // length 100
    expiration_date: Date;
    type: VerificationType;
    verified: boolean;
    active: boolean;
    
}

export interface VerificationInput extends Omit<VerificationAttributes, 'id' | 'verified'| 'active'> {}

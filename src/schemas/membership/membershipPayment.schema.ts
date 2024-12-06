export interface MembershipPaymentAttributes {
    id: number;
    clientId: number;
    startDate: Date;
    endDate: Date;
    amount: number;
    active: boolean;
}

export interface MembershipPaymentInput extends Omit<MembershipPaymentAttributes, 'id' | 'active'> { }

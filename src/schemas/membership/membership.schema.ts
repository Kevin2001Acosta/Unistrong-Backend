export interface MembershipAttributes {
    id: number;
    clientId: bigint;
    startDate: Date;
    endDate: Date;
    active: boolean;
}

export interface MembershipInput extends Omit<MembershipAttributes, 'id' | 'active'> { }

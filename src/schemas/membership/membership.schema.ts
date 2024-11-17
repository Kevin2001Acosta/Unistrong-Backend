export interface MembershipAttributes {
    id: number;
    clientId: number;
    startDate: Date;
    endDate: Date;
    price: number;
    active: boolean;
}

export interface MembershipInput extends Omit<MembershipAttributes, 'id' | 'active'> { }

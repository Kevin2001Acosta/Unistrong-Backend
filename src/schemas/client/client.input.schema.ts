export interface ClientInput {
  user_id: number;
  coach_id?: number;
  nutritionist_id?: number;
  birthDate?: Date;
  height?: number;
  diseases?: string[];
  dietaryRestrictions?: string[];
  clientStats?: boolean;
  membershipId?: number;
}

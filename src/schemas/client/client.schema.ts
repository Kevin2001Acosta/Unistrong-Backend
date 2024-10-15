import Users from "../../models/user.model";
export interface ClientAttributes {
  id: number;
  userId: number;
  coachId: number;
  nutritionistId: number;
  birthDate: Date;
  height: number;
  diseases?: string[];
  dietaryRestrictions?: string[];
  user?: Users;
}

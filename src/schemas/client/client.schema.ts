import Users from "../../db/models/user.model";
import { MembershipAttributes } from "../membership/membership.schema";
export interface ClientAttributes {
  id: number;
  user_id: number;
  coach_id?: number;
  nutritionist_id?: number;
  birthDate: Date;
  height: number;
  diseases?: string[];
  dietaryRestrictions?: string[];
  user?: Users;
  membershipId?: number;
  membership?: MembershipAttributes;
}

import Users from "../../db/models/user.model";
import { TypeMembershipAttributes } from "../membership/typeMembership.schema";
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
  typeMembershipId?: number;
  typeMembership?: TypeMembershipAttributes;
  clientStats?: boolean;
}

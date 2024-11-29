import Users from "../../db/models/user.model";
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
<<<<<<< HEAD
  clientStats?: boolean;
=======
  typeMembershipId?: number;
  typeMembership?: TypeMembershipAttributes;
>>>>>>> origin/master
}

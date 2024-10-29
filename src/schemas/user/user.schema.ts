import { UserType } from "../../db/models/utils/user.types";
export interface UserAtributes {
  id: number;
  email: string;
  name: string;
  dni: string;
  username: string;
  password: string;
  phoneNumber: String;
  state?: Boolean;
  user_type?: UserType;
}

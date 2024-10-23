import { UserState } from "../../models/utils/user.state";
import { UserType } from "../../models/utils/user.types";
export interface UserInput {
  email: string;
  name: string;
  dni: string;
  username: string;
  password: string;
  phoneNumber: string;
  state?: boolean;
  user_type?: UserType;
}

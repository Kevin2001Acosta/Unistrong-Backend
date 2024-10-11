import { UserState } from "../../db/models/utils/user.state";
import { UserType } from "../../db/models/utils/user.types";
export interface UserInput {
  email: string;
  name: string;
  dni: string;
  username: string;
  password: string;
  phoneNumber: string;
  state?: UserState;
  user_type?: UserType;
}

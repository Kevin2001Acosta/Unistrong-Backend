import { UserState } from "../../models/utils/user.state";
export interface UserInput {
  email: string;
  name: string;
  dni: string;
  username: string;
  password: string;
  phoneNumber: string;
  state?: UserState;
}

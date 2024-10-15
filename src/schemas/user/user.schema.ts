import { UserState } from "../../models/utils/user.state";
export interface UserAtributes {
  id: number;
  email: string;
  name: string;
  dni: string;
  username: string;
  password: string;
  phoneNumber: String;
  state: UserState;
}

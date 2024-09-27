import { UserType } from "../../db/models/utils/user.types";
import { UserState } from "../../db/models/utils/user.state";
export interface UserAtributes {
  id: number;
  email: string;
  name: string;
  type: UserType;
  dni: string;
  username: string;
  password: string;
  state: UserState;
  phoneNumber: String;
}

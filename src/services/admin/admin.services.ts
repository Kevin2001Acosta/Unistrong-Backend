import Admin from "../../db/models/admin.models";
import Coach from "../../db/models/coach.models";
import Nutritionist from "../../db/models/nutritionist.model";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";
import { AdminInput } from "../../schemas/admin/admin.schema";
import { CoachInputAdmin } from "../../schemas/coach/coach.input.admin";
import { NutriInputAdmin } from "../../schemas/nutritionist/nutri.input.admin";

class AdminService {
  async createAdmin(adminData: AdminInput): Promise<Admin> {
    const user = await Users.findOne({ where: { email: adminData.email } });

    if (!user) {
      throw new Error("El usuario con el email proporcionado no existe.");
    }

    const existingAdmin = await Admin.findOne({ where: { user_id: user.id } });
    if (existingAdmin) {
      throw new Error("El usuario ya está registrado como administrador.");
    }

    user.userType = UserType.ADMIN;
    await user.save();

    const newAdmin = await Admin.create({ user_id: user.id });
    return newAdmin;
  }

  async createCoach(coachData: CoachInputAdmin): Promise<Coach> {
    const user = await Users.findOne({ where: { email: coachData.email } });
    if (!user) {
      throw new Error("El usuario con el email proporcionado no existe.");
    }

    const existingCoach = await Coach.findOne({ where: { user_id: user.id } });
    if (existingCoach) {
      throw new Error("El usuario ya está registrado como coach.");
    }

    user.userType = UserType.COACH;
    await user.save();
    const newCoach = await Coach.create({ user_id: user.id });
    return newCoach;
  }

  async createNutri(coachData: NutriInputAdmin): Promise<Nutritionist> {
    const user = await Users.findOne({ where: { email: coachData.email } });
    if (!user) {
      throw new Error("El usuario con el email proporcionado no existe.");
    }

    const existingNutri = await Nutritionist.findOne({
      where: { user_id: user.id },
    });
    if (existingNutri) {
      throw new Error("El usuario ya está registrado como nutriologo.");
    }

    user.userType = UserType.NUTRITIONIST;
    await user.save();
    const newNutri = await Nutritionist.create({ user_id: user.id });
    return newNutri;
  }

  async AdminExist(id: number): Promise<boolean | null> {
    try {
      const admin = await Admin.findOne({
        where: {
          user_id:id,
        },
        attributes: ["user_id"],
      });

      if (!admin) {
        throw new Error("El administrador no existe");
      }
      
      return true;
    } catch (error) {
      throw new Error(
        `Error al obtener el administrador: ${(error as Error).message}`
      );
    }
  }
}

export default new AdminService();

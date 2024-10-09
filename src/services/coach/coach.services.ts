import { CoachInput } from "../../schemas/coach/coach.input.schemas";
import { CoachAtributes } from "../../schemas/coach/coach.schemas";
import Coach from "../../db/models/coach.models";
import Client from "../../db/models/client.models";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";

class CoachService {
  async createCoach(coachData: CoachInput): Promise<CoachAtributes> {
    try {
      const user = await Users.findByPk(coachData.user_id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      if (user.user_type !== UserType.COACH) {
        user.user_type = UserType.COACH;
        await user.save();
      }

      const coach = await Coach.create({ user_id: coachData.user_id });
      return coach;
    } catch (error) {
      throw new Error(`Error al crear coach: ${(error as Error).message}`);
    }
  }

  async getAllCoach(): Promise<any[]> {
    try {
      const coaches = await Coach.findAll({
        include: [
          {
            model: Users,
            as: "user",
            attributes: [
              "id",
              "email",
              "name",
              "dni",
              "username",
              "phoneNumber",
              "user_type",
            ],
          },
        ],
      });

      return coaches.length > 0 ? coaches : [];
    } catch (error) {
      throw new Error(
        `Error al obtener todos los coaches: ${(error as Error).message}`
      );
    }
  }

  async getClientsByCoachId(coachId: number): Promise<any> {
    try {
      const coachWithClients = await Coach.findByPk(coachId, {
        include: [{ model: Client, as: "clients" }],
      });

      if (!coachWithClients) {
        throw new Error("Coach no encontrado");
      }

      return coachWithClients;
    } catch (error) {
      throw new Error(
        `Error al obtener clientes del coach: ${(error as Error).message}`
      );
    }
  }
  async getCoachById(coachId: number): Promise<CoachAtributes | null> {
    try {
      const coach = await Coach.findByPk(coachId, {
        include: [
          {
            model: Users,
            as: "user",
            attributes: [
              "id",
              "email",
              "name",
              "dni",
              "username",
              "phoneNumber",
              "user_type",
            ],
          },
        ],
      });

      if (!coach) {
        throw new Error("Coach no encontrado");
      }

      return coach;
    } catch (error) {
      throw new Error(
        `Error al obtener coach por ID: ${(error as Error).message}`
      );
    }
  }
}

export default new CoachService();

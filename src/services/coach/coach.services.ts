import { CoachInput } from "../../schemas/coach/coach.input.schemas";
import { CoachAtributes } from "../../schemas/coach/coach.schemas";
import Coach from "../../db/models/coach.models";
import Client from "../../db/models/client.models";

class CoachService {
  async createCoach(coachData: CoachInput): Promise<CoachAtributes> {
    try {
      console.log("coach:", coachData);
      const coach = await Coach.create(coachData);
      return coach;
    } catch (error) {
      throw new Error(`Error al crear cliente: ${(error as Error).message}`);
    }
  }

  async getAllCoach(): Promise<CoachAtributes[]> {
    try {
      const coaches = await Coach.findAll();
      return coaches.length > 0 ? coaches : [];
    } catch (error) {
      throw new Error(
        `Error al obtener todos los clientes: ${(error as Error).message}`
      );
    }
  }

  // obtener los clientes de un coach
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
}

export default new CoachService();

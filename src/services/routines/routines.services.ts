import { RoutinesInput } from "../../schemas/routines/routines.input.schema";
import { RoutinesAttributes } from "../../schemas/routines/routines.schema";
import Routines from "../../db/models/routines.models";
import Client from "../../db/models/client.models";
import Coach from "../../db/models/coach.models";
import ClientRoutines from "../../db/models/client_routines";
import { assignRoutineInput } from "../../schemas/routines/assign.routines.input";

class RoutineService {
  async createRoutine(routineData: RoutinesInput): Promise<RoutinesAttributes> {
    try {
      const coach = await Coach.findByPk(routineData.coachId);
      if (!coach) {
        throw new Error("Coach no encontrado");
      }
      const routine = await Routines.create(routineData);
      return routine;
    } catch (error) {
      throw new Error(`Error al crear la rutina: ${(error as Error).message}`);
    }
  }

  // Obtener todas las rutinas
  async getAllRoutines(): Promise<RoutinesAttributes[]> {
    try {
      const routines = await Routines.findAll({
        include: [
          {
            model: Client,
            as: "clients",
          },
        ],
      });

      return routines.length > 0 ? routines : [];
    } catch (error) {
      throw new Error(
        `Error al obtener las rutinas: ${(error as Error).message}`
      );
    }
  }
  async assignRoutineToClient(data: assignRoutineInput): Promise<void> {
    const { clientId, routineId } = data;
    try {
      // Verificar si el cliente y la rutina existen
      console.log(`Buscando cliente con ID: ${clientId}`);
      const clientExists = await Client.findByPk(clientId);
      if (!clientExists) {
        console.log(`Cliente con ID ${clientId} no encontrado.`);
        throw new Error("El cliente especificado no existe.");
      }

      console.log(`Buscando rutina con ID: ${routineId}`);
      const routineExists = await Routines.findByPk(routineId);
      if (!routineExists) {
        console.log(`Rutina con ID ${routineId} no encontrada.`);
        throw new Error("La rutina especificada no existe.");
      }

      // Asignar la rutina al cliente en la tabla intermedia
      await ClientRoutines.create({ clientId, routineId });
      console.log(
        `Rutina con ID ${routineId} asignada al cliente con ID ${clientId}.`
      );
    } catch (error) {
      console.error(`Error al asignar la rutina: ${(error as Error).message}`);
      throw new Error(
        `Error al asignar la rutina: ${(error as Error).message}`
      );
    }
  }
}

export default new RoutineService();

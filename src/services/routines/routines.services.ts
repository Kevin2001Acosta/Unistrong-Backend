import { RoutinesInput } from "../../schemas/routines/routines.input.schema";
import { RoutinesAttributes } from "../../schemas/routines/routines.schema";
import Routines from "../../db/models/routines.models";
import Client from "../../db/models/client.models";

class RoutineService {
  async createRoutine(routineData: RoutinesInput): Promise<RoutinesAttributes> {
    try {
      // Verificar si el Client existe
      const clientExists = await Client.findByPk(routineData.clientId);
      if (!clientExists) {
        throw new Error("El cliente especificado no existe.");
      }

      // Crear la rutina
      const routine = await Routines.create(routineData);
      return routine;
    } catch (error) {
      throw new Error(`Error al crear la rutina: ${(error as Error).message}`);
    }
  }

  async getAllRoutines(): Promise<RoutinesAttributes[]> {
    try {
      const routines = await Routines.findAll();
      return routines.length > 0 ? routines : [];
    } catch (error) {
      throw new Error(
        `Error al obtener las rutinas: ${(error as Error).message}`
      );
    }
  }

  // Obtener rutinas por ID de coach
  async getRoutinesByCoach(coachId: number): Promise<RoutinesAttributes[]> {
    try {
      const routines = await Routines.findAll({ where: { coachId } });
      return routines.length > 0 ? routines : [];
    } catch (error) {
      throw new Error(
        `Error al obtener las rutinas del coach: ${(error as Error).message}`
      );
    }
  }

  // Obtener rutinas por ID de cliente
  async getRoutinesByClient(clientId: number): Promise<RoutinesAttributes[]> {
    try {
      const routines = await Routines.findAll({ where: { clientId } });
      return routines.length > 0 ? routines : [];
    } catch (error) {
      throw new Error(
        `Error al obtener las rutinas del cliente: ${(error as Error).message}`
      );
    }
  }
}

export default new RoutineService();

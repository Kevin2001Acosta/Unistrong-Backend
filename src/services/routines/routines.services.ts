import { RoutinesInput } from "../../schemas/routines/routines.input.schema";
import { RoutinesAttributes } from "../../schemas/routines/routines.schema";
import Routines from "../../db/models/routines.models";
import Client from "../../db/models/client.models";
import Coach from "../../db/models/coach.models";
import ClientRoutines from "../../db/models/client_routines";
import { assignRoutineInput } from "../../schemas/routines/assign.routines.input";
import CoachService from "../coach/coach.services";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";

class RoutineService {
  async createRoutine(routineData: RoutinesInput): Promise<RoutinesAttributes> {
    try {
      const coach = await Coach.findByPk(routineData.coachId);
      const id = coach?.id;
      if (!id) {
        throw new Error("Coach no encontrado");
      }
      routineData.coachId = id;
      const routine = await Routines.create(routineData);
      return routine;
    } catch (error) {
      throw new Error(`Error al crear la rutina: ${(error as Error).message}`);
    }
  }

  // Obtener todas las rutinas con sus clientes asignados
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
  // Asignar rutina a cliente
  async assignRoutineToClient(data: assignRoutineInput): Promise<void> {
    const { clientId, routineId } = data;
    try {
      // Verificar si el cliente y la rutina existen
      const clientExists = await Client.findByPk(clientId);
      if (!clientExists) {
        throw new Error("El cliente especificado no existe.");
      }
      const routineExists = await Routines.findByPk(routineId);
      if (!routineExists) {
        throw new Error("La rutina especificada no existe.");
      }
      // Asignar la rutina al cliente en la tabla intermedia
      await ClientRoutines.create({
        clientId,
        routineId,
        scheduledDate: new Date(),
      });
    } catch (error) {
      throw new Error(
        `Error al asignar la rutina: ${(error as Error).message}`
      );
    }
  }

  async assignRoutineByEmail(
    email: string,
    routineId: number,
    scheduledDate: Date
  ): Promise<void> {
    try {
      // Buscar el usuario por email
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }
      if (user.userType !== UserType.CLIENT) {
        throw new Error("El usuario especificado no es un cliente.");
      }

      // Verificar si el cliente existe en la tabla clientes
      const client = await Client.findOne({ where: { user_id: user.id } });
      if (!client) {
        throw new Error("Cliente no encontrado.");
      }
      //Busca la rutina por nombre
      // const routine = await Routines.findOne({ where: { name: routineName } });
      // if (!routine) {
      //   throw new Error("La rutina especificada no existe.");
      // }

      const routine = await Routines.findByPk(routineId);
      if (!routine) {
        throw new Error("La rutina especificada no existe.");
      }

      // Asignar el coach_id al cliente si no aun no tiene
      if (!client.coach_id) {
        await client.update({ coach_id: routine.coachId });
        console.log("Coach asignado al cliente");
      }

      // Asignar la rutina al cliente en la tabla intermedia
      await ClientRoutines.create({
        clientId: client.id,
        routineId: routine.id,
        scheduledDate,
      });
    } catch (error) {
      throw new Error(
        `Error al asignar la rutina: ${(error as Error).message}`
      );
    }
  }

  async getRoutinesByClientId(clientId: number) {
    try {
      // Validar el id del cliente
      const validClientId = Number(clientId);
      console.log(typeof validClientId, validClientId);

      if (isNaN(validClientId)) {
        throw new Error("El id de Cliente no es un número válido");
      }

      const client = await Client.findByPk(validClientId, {
        include: {
          model: Routines,
          as: "routines",
          through: { attributes: [] },
        },
      });

      if (!client) {
        throw new Error("Cliente no Existe");
      }

      if (!client.routines || client.routines.length === 0) {
        return { message: "Este cliente no tiene rutinas asignadas." };
      }
      return client.routines;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getRoutinesByCoachId(coachId: number) {
    try {
      const coach = await Coach.findByPk(coachId, {
        include: [
          {
            model: Routines,
            as: "routines",
            attributes: [
              "id",
              "name",
              "description",
              "category",
              "musclesWorked",
            ],
          },
        ],
      });

      if (!coach) {
        throw new Error("Coach no encontrado.");
      }

      return coach;
    } catch (error) {
      throw new Error(`Error al obtener rutinas: ${(error as Error).message}`);
    }
  }
}

export default new RoutineService();

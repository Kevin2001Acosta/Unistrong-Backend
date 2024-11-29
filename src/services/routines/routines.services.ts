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
import { calculateRecurrentDates } from "./calculateRoutines.services";

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
    scheduledDate?: Date,
    recurrenceDay?: number, // Día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    time?: string // Hora en formato "HH:mm"
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

      // Buscar la rutina por ID
      const routine = await Routines.findByPk(routineId);
      if (!routine) {
        throw new Error("La rutina especificada no existe.");
      }

      // Asignar el coach_id al cliente si no tiene uno
      if (!client.coach_id) {
        await client.update({ coach_id: routine.coachId });
        console.log("Coach asignado al cliente");
      }

      // Validar que al menos uno de los parámetros sea proporcionado
      if (!scheduledDate && (recurrenceDay === undefined || !time)) {
        throw new Error(
          "Debes proporcionar una fecha (scheduledDate) o un día de recurrencia (recurrenceDay) y una hora (time)."
        );
      }

      // Validar datos de recurrencia
      if (recurrenceDay !== undefined && time) {
        const existingRecurringAssignment = await ClientRoutines.findOne({
          where: {
            clientId: client.id,
            routineId: routine.id,
            recurrenceDay,
            time,
          },
        });
        if (existingRecurringAssignment) {
          throw new Error(
            "La rutina ya está asignada con esa recurrencia (día y hora)."
          );
        }

        await ClientRoutines.create({
          clientId: client.id,
          routineId: routine.id,
          recurrenceDay,
          time,
        });

        console.log("Rutina recurrente asignada con éxito.");
      }

      // Validar asignación puntual con scheduledDate
      if (scheduledDate) {
        const existingScheduledAssignment = await ClientRoutines.findOne({
          where: {
            clientId: client.id,
            routineId: routine.id,
            scheduledDate,
          },
        });
        if (existingScheduledAssignment) {
          throw new Error(
            "La rutina ya está asignada en la fecha especificada."
          );
        }

        await ClientRoutines.create({
          clientId: client.id,
          routineId: routine.id,
          scheduledDate,
        });

        console.log("Rutina asignada en la fecha específica.");
      }
    } catch (error) {
      throw new Error(
        `Error al asignar la rutina: ${(error as Error).message}`
      );
    }
  }

  async getRoutinesByClientId(clientId: number) {
    try {
      const client = await Client.findByPk(clientId, {
        include: [
          {
            model: Routines,
            as: "routines",
            through: {
              attributes: ["scheduledDate", "recurrenceDay", "time"],
            },
          },
        ],
      });

      if (!client) {
        throw new Error("Cliente no encontrado.");
      }

      // Verificar si el cliente tiene rutinas
      if (!client.routines || client.routines.length === 0) {
        return { message: "Este cliente no tiene rutinas asignadas." };
      }

      //Retorna las rutinas con los atributos adicionales de la tabla intermedia
      const routinesWithClientDetails = client.routines.map((routine: any) => {
        const { client_routines, ...routineData } = routine.toJSON(); // se eliminan los datos de 'client_routines' para evitar duplicados
        const { scheduledDate, recurrenceDay, time } = client_routines || {}; // Accedemos a los datos de 'client_routines'

        let recurrentDates: Date[] = [];
        // Si existen recurrenceDay y time, calculamos las fechas recurrentes
        if (recurrenceDay !== null && time) {
          recurrentDates = calculateRecurrentDates(
            recurrenceDay,
            time,
            scheduledDate
          );
        }

        return {
          ...routineData, // Retornamos solo los datos de la rutina
          scheduledDate: scheduledDate || new Date().toISOString(), // Si no hay scheduledDate, usamos la fecha actual
          recurrenceDay,
          time,
          recurrentDates, // Añadimos las fechas recurrentes calculadas
        };
      });

      return routinesWithClientDetails;
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

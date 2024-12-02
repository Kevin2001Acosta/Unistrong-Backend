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
import { format } from "date-fns";

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
    scheduledDate: Date,
    recurrenceDay: number
  ): Promise<{ recurrentDates: Date[] }> {
    try {
      // Buscar el usuario por email
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      if (user.userType !== UserType.CLIENT) {
        throw new Error("El usuario especificado no es un cliente.");
      }

      // Buscar el cliente asociado al usuario
      const client = await Client.findOne({ where: { user_id: user.id } });
      if (!client) {
        throw new Error("Cliente no encontrado.");
      }

      // Verificar si la rutina existe
      const routine = await Routines.findByPk(routineId);
      if (!routine) {
        throw new Error("Rutina no encontrada.");
      }

      // Extraer la hora desde `scheduledDate`
      const hours = scheduledDate.getHours();
      const minutes = scheduledDate.getMinutes();
      const time = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      // Generar fechas recurrentes usando `calculateRecurrentDates`
      const recurrentDates = calculateRecurrentDates(
        recurrenceDay,
        time,
        scheduledDate
      );

      // Crear asignación de la rutina
      await ClientRoutines.create({
        clientId: client.id,
        routineId: routine.id,
        scheduledDate,
        recurrenceDay,
        time,
      });

      return { recurrentDates };
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

      if (!client.routines || client.routines.length === 0) {
        return { message: "Este cliente no tiene rutinas asignadas." };
      }

      const routinesWithClientDetails = client.routines.map((routine: any) => {
        const { client_routines, ...routineData } = routine.toJSON();
        const { scheduledDate, recurrenceDay, time } = client_routines || {};

        let recurrentDates: string[] = [];
        if (recurrenceDay !== null && scheduledDate) {
          const initialDate = new Date(scheduledDate);
          recurrentDates = calculateRecurrentDates(
            recurrenceDay,
            time || format(initialDate, "HH:mm"),
            initialDate
          ).map((date) => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")); // Formato ISO con zona horaria local
        }

        return {
          ...routineData,
          scheduledDate: format(
            new Date(scheduledDate),
            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
          ),
          recurrenceDay,
          time,
          recurrentDates,
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
            include: [
              {
                model: Client,
                as: "clients",
                attributes: ["id", "user_id", "coach_id"], // Agrega los atributos necesarios del cliente
                through: {
                  attributes: ["scheduledDate", "recurrenceDay", "time"], // Atributos de la tabla intermedia
                },
              },
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

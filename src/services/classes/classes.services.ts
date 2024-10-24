import Classes from "../../models/classes.models";
import Coach from "../../models/coach.models";
import { ClassesInput } from "../../schemas/classes/classes.input.schema";
import { ClassesAtributes } from "../../schemas/classes/classes.schema";

class ClassesService {
  async createClass(classData: ClassesInput): Promise<ClassesAtributes> {
    try {
      const coach = await Coach.findByPk(classData.coachId);
      if (!coach) {
        throw new Error("Coach no encontrado");
      }
      const classes = await Classes.create(classData);
      return classes;
    } catch (error) {
      throw new Error(`Error al crear la clase: ${(error as Error).message}`);
    }
  }

  // Obtener todas las rutinas con sus clientes asignados
  async getAllClasses(): Promise<ClassesAtributes[]> {
    try {
      const classes = await Classes.findAll({
        include: [
          {
            model: Coach,
            as: "coach",
          },
        ],
      });

      return classes.length > 0 ? classes : [];
    } catch (error) {
      throw new Error(
        `Error al obtener las clases: ${(error as Error).message}`
      );
    }
  }
}

export default new ClassesService();

import Classes from "../../db/models/classes.models";
import Coach from "../../db/models/coach.models";
class ClassesService {
    async createClass(classData) {
        try {
            const coach = await Coach.findByPk(classData.coachId);
            if (!coach) {
                throw new Error("Coach no encontrado");
            }
            const classes = await Classes.create(classData);
            return classes;
        }
        catch (error) {
            throw new Error(`Error al crear la clase: ${error.message}`);
        }
    }
    async getAllClasses() {
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
        }
        catch (error) {
            throw new Error(`Error al obtener las clases: ${error.message}`);
        }
    }
}
export default new ClassesService();

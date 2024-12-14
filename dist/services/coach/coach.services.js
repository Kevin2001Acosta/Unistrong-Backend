import Coach from "../../db/models/coach.models";
import Client from "../../db/models/client.models";
import Users from "../../db/models/user.model";
import { UserType } from "../../db/models/utils/user.types";
class CoachService {
    async createCoach(coachData) {
        try {
            const user = await Users.findByPk(coachData.user_id);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            user.userType = UserType.COACH;
            await user.save();
            const coach = await Coach.create({ user_id: coachData.user_id });
            return coach;
        }
        catch (error) {
            throw new Error(`Error al crear coach: ${error.message}`);
        }
    }
    //Obtener todos los coaches con su informacion de usuario
    async getAllCoach() {
        try {
            const coaches = await Coach.findAll({
                include: [
                    {
                        model: Users,
                        as: "user",
                        attributes: ["id", "email", "name"],
                    },
                ],
            });
            return coaches.length > 0 ? coaches : [];
        }
        catch (error) {
            throw new Error(`Error al obtener todos los coaches: ${error.message}`);
        }
    }
    async getClientsByCoachId(coachId) {
        try {
            const coachWithClients = await Coach.findByPk(coachId, {
                include: [{ model: Client, as: "clients" }],
            });
            if (!coachWithClients) {
                throw new Error("Coach no encontrado");
            }
            return coachWithClients;
        }
        catch (error) {
            throw new Error(`Error al obtener clientes del coach: ${error.message}`);
        }
    }
    async getCoachById(coachId) {
        try {
            const coach = await Coach.findByPk(coachId, {
                include: [
                    {
                        model: Users,
                        as: "user",
                    },
                ],
            });
            if (!coach) {
                throw new Error("Coach no encontrado");
            }
            return coach;
        }
        catch (error) {
            throw new Error(`Error al obtener coach por ID: ${error.message}`);
        }
    }
    async getCoachByUser(userId) {
        try {
            const coach = await Coach.findOne({
                where: {
                    user_id: userId,
                },
            });
            return coach;
        }
        catch (error) {
            throw new Error(`Error al obtener el coach: ${error.message}`);
        }
    }
}
export default new CoachService();

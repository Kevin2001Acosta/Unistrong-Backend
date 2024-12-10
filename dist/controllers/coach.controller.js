import CoachService from "../services/coach/coach.services";
import createError from "http-errors";
class CoachController {
    async createCoach(req, res, next) {
        try {
            const coach = await CoachService.createCoach(req.body);
            res.status(201).json(coach);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getAllCoaches(req, res, next) {
        try {
            const coaches = await CoachService.getAllCoach();
            res.status(200).json(coaches);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getCoachById(req, res, next) {
        try {
            const coachId = parseInt(req.params.id);
            if (isNaN(coachId)) {
                throw new Error("ID de coach inválido");
            }
            const coach = await CoachService.getCoachById(coachId);
            res.status(200).json(coach);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getClientsByCoachId(req, res, next) {
        try {
            const coachId = parseInt(req.params.id);
            if (isNaN(coachId)) {
                throw new Error("ID de coach inválido");
            }
            const coachWithClients = await CoachService.getClientsByCoachId(coachId);
            res.status(200).json(coachWithClients);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
}
export default new CoachController();

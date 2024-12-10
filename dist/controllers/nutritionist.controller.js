import NutritionistService from "../services/nutritionist/nutritionist.services";
import createError from "http-errors";
class NutritionistController {
    async createNutritionist(req, res, next) {
        try {
            const nutri = await NutritionistService.createNutritionist(req.body);
            res.status(201).json(nutri);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getAllNutritionist(req, res, next) {
        try {
            const nutri = await NutritionistService.getAllNutritionist();
            res.status(200).json(nutri);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
}
export default new NutritionistController();

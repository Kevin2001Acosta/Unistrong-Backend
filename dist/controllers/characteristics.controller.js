import charactetisticsServices from "../services/characteristics/charactetistics.services";
import createError from "http-errors";
class CharacteristicsController {
    async createCharacteristics(req, res, next) {
        try {
            const characteristics = await charactetisticsServices.createCharacteristics(req.body);
            res.status(201).json(characteristics);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getAllCharacteristics(req, res, next) {
        try {
            const characteristics = await charactetisticsServices.getCharacteristics();
            res.status(200).json(characteristics);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getCharacteristicsById(req, res, next) {
        try {
            const characteristics = await charactetisticsServices.getCharacteristicsByClientId(Number(req.params.id));
            res.status(200).json(characteristics);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
}
export default new CharacteristicsController();

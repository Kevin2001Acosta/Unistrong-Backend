import createHttpError from "http-errors";
import ClassesService from "../services/classes/classes.services";
class ClassesController {
    async createClass(req, res, next) {
        try {
            const classes = await ClassesService.createClass(req.body);
            res.status(201).json(classes);
        }
        catch (error) {
            next(createHttpError(400, error.message));
        }
    }
    async getAllClasses(req, res, next) {
        try {
            const classes = await ClassesService.getAllClasses();
            res.status(200).json(classes);
        }
        catch (error) {
            next(createHttpError(400, error.message));
        }
    }
}
export default new ClassesController();

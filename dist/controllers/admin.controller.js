import adminServices from "../services/admin/admin.services";
import createError from "http-errors";
import AdminService from "../services/admin/admin.services";
class AdminController {
    async createAdmin(req, res, next) {
        try {
            const user = await adminServices.createAdmin(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async createUserAnyType(req, res, next) {
        try {
            const user = await AdminService.createUserAnyType(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async assignCoachToClient(req, res, next) {
        try {
            const { clientEmail, coachEmail } = req.body;
            // Validación de parámetros
            if (!clientEmail || !coachEmail) {
                throw new Error("Se requiere el correo electrónico del cliente y del coach.");
            }
            const result = await AdminService.assignCoachToClient(clientEmail, coachEmail);
            res.status(200).json({ message: "Coach asignado correctamente", result });
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async assignNutriToClient(req, res, next) {
        try {
            const { clientEmail, nutriEmail } = req.body;
            // Validación de parámetros
            if (!clientEmail || !nutriEmail) {
                throw new Error("Se requiere el correo electrónico del cliente y del nutriologo.");
            }
            const result = await AdminService.assignNutritionistToClient(clientEmail, nutriEmail);
            res
                .status(200)
                .json({ message: "Nutriologo asignado correctamente", result });
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
}
export default new AdminController();

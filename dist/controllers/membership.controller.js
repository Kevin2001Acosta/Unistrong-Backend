import createError from "http-errors";
import membershipServices from "../services/membership/membership.services";
class MembershipController {
    async registerMembership(req, res, next) {
        const { userId, startDate, endDate } = req.body;
        try {
            // Aquí iría la lógica para registrar la membresía
            const membership = await membershipServices.registerMembership(userId, startDate, endDate);
            res.status(201).json({
                membership,
                message: "Membresía registrada"
            });
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getMembershipRemainingDays(req, res, next) {
        const userId = req.body.userId;
        try {
            const infoRemainingDays = await membershipServices.getMembershipRemainingDays(userId);
            res.status(200).json(infoRemainingDays); // devuelve: remainingDays, endDate, message
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
}
export default new MembershipController();

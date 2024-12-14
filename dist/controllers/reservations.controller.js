import reservationsServices from "../services/reservations/reservations.services";
import createError from "http-errors";
class ReservationController {
    async createReservation(req, res, next) {
        try {
            const reservation = await reservationsServices.createReservation(req.body);
            res.status(201).json(reservation);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
    async getAllReservations(req, res, next) {
        try {
            const reservations = await reservationsServices.getAllReservations();
            res.status(200).json(reservations);
        }
        catch (error) {
            next(createError(400, error.message));
        }
    }
}
export default new ReservationController();

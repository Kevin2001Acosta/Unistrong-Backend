import Classes from "../../db/models/classes.models";
import Client from "../../db/models/client.models";
import Reservations from "../../db/models/reservations.models";
class ReservationsServices {
    async createReservation(reservationData) {
        try {
            const client = await Client.findByPk(reservationData.clientId);
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            const classes = await Classes.findByPk(reservationData.classId);
            if (!classes) {
                throw new Error("Clase no encontrada");
            }
            const existingReservation = await Reservations.findOne({
                where: {
                    clientId: reservationData.clientId,
                    classId: reservationData.classId,
                },
            });
            if (existingReservation) {
                throw new Error("El cliente ya ha reservado esta clase.");
            }
            const reservation = await Reservations.create(reservationData);
            return reservation;
        }
        catch (error) {
            throw new Error(`Error al crear la reserva: ${error.message}`);
        }
    }
    async getAllReservations() {
        try {
            const reservations = await Reservations.findAll({
                include: [
                    {
                        model: Client,
                        as: "assistants",
                        attributes: ["id"],
                    },
                    {
                        model: Classes,
                        as: "class",
                    },
                ],
            });
            return reservations.length > 0 ? reservations : [];
        }
        catch (error) {
            throw new Error(`Error al obtener las reservas: ${error.message}`);
        }
    }
}
export default new ReservationsServices();

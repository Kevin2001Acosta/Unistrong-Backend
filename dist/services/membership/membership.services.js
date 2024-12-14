import MembershipPayment from "../../db/models/membership.payment.models";
import clientServices from "../client/client.services";
class MembershipServices {
    async registerMembership(userId, startDate, endDate) {
        try {
            // verificar que el cliente exista y devolver su tipo de membresía y el valor a pagar
            const client = await clientServices.getClientByUserId(userId);
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            if (!client.membership) {
                throw new Error("El cliente no tiene un tipo de membresía asignado");
            }
            // registrar la membresía
            const membership = await MembershipPayment.create({
                clientId: client.id,
                startDate,
                endDate,
                amount: client.membership.price,
            });
            return membership;
        }
        catch (error) {
            throw new Error(`Error al pagar membresía: ${error.message}`);
        }
    }
    async getMembershipRemainingDays(userId) {
        try {
            // verificar que el cliente exista y devolver los días restantes de la membresía
            const client = await clientServices.getClientByUserId(userId);
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            if (!client.membership) {
                throw new Error("El cliente no tiene un tipo de membresía asignado");
            }
            // obtener los días restantes de la membresía
            const membership = await MembershipPayment.findOne({
                where: { clientId: client.id, active: true },
                order: [["createdAt", "DESC"]], // trae el pago más reciente
            });
            if (!membership) {
                throw new Error("No Tienes membresías pagadas");
            }
            // Calcular los días restantes
            const endDate = new Date(membership.endDate);
            const today = new Date();
            const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            // Determinar el mensaje personalizado
            const message = remainingDays > 0
                ? `Tu membresía vence en ${remainingDays} días.`
                : `Tu membresía venció el ${endDate.toLocaleDateString()}.`;
            return {
                remainingDays, // positivo, no ha vencido; negativo, ya venció
                endDate, // fecha de vencimiento
                message, // mensaje personalizado
            };
        }
        catch (error) {
            throw new Error(`Error al obtener los días restantes de la membresía: ${error.message}`);
        }
    }
}
export default new MembershipServices();

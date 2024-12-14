import MembershipPayment from "../../db/models/membership.payment.models";
import { MembershipPaymentAttributes } from "../../schemas/membership/membershipPayment.schema";
import clientServices from "../client/client.services";



class MembershipServices {

    async registerMembership(userId: number, startDate: Date, endDate: Date): Promise<MembershipPaymentAttributes> {
        try{
        // verificar que el cliente exista y devolver su tipo de membresía y el valor a pagar
        const client = await clientServices.getClientByUserId(userId);
        if (!client) {
            throw new Error("Cliente no encontrado");
        }
        if(!client.membership){
            throw new Error("El cliente no tiene un tipo de membresía asignado");
        }
        const { remainingDays } = await this.getMembershipRemainingDays(userId);
        if(remainingDays > 0){
            throw new Error("No puedes pagar una membresía si tienes una activa");
        }

        // registrar la membresía
        const membership = await MembershipPayment.create({
            clientId: client.id,
            startDate,
            endDate,
            amount: client.membership.price,
        });

        return membership;

        } catch (error) {
            throw new Error(`Error al pagar membresía: ${(error as Error).message}`);
        }

    }

    async getMembershipRemainingDays(userId: number){
        try{
            // verificar que el cliente exista y devolver los días restantes de la membresía
            const client = await clientServices.getClientByUserId(userId);
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            if(!client.membership){
                throw new Error("El cliente no tiene un tipo de membresía asignado");
            }

            // obtener los días restantes de la membresía
            const membership = await MembershipPayment.findOne({
                where: {clientId: client.id, active: true},
                order: [["createdAt", "DESC"]], // trae el pago más reciente
            });

            if(!membership){
                return {
                    remainingDays: 0, // positivo, no ha vencido; negativo, ya vencio
                    message: "No tienes membresías pagadas aún", // mensaje personalizado
                    };
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

        } catch (error) {
            throw new Error(`Error al obtener los días restantes de la membresía: ${(error as Error).message}`);
        }
    }
}


export default new MembershipServices();
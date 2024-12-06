import MembershipPayment from "../../db/models/membership.payment.models";
import { MembershipPaymentAttributes } from "../../schemas/membership/membershipPayment.schema";
import clientServices from "../client/client.services";



class MembershipServices {

    async registerMembership(clientId: number, startDate: Date, endDate: Date): Promise<MembershipPaymentAttributes> {
        try{
        // verificar que el cliente exista y devolver su tipo de membresía y el valor a pagar
        const client = await clientServices.getClientById(clientId);
        if (!client) {
            throw new Error("Cliente no encontrado");
        }
        if(!client.membership){
            throw new Error("El cliente no tiene un tipo de membresía asignado");
        }

        // registrar la membresía
        const membership = await MembershipPayment.create({
            clientId,
            startDate,
            endDate,
            amount: client.membership.price,
        });

        return membership;

        } catch (error) {
            throw new Error(`Error al pagar membresía: ${(error as Error).message}`);
        }

    }
}


export default new MembershipServices();
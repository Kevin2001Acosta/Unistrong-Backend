import Membership from "../../db/models/membership.models";
import { MembershipAttributes } from "../../schemas/membership/membership.schema";
import clientServices from "../client/client.services";



class MembershipServices {

    async registerMembership(clientId: number, startDate: Date, endDate: Date): Promise<MembershipAttributes> {
        try{
        // verificar que el cliente exista y devolver su tipo de membresía y el valor a pagar
        const client = await clientServices.getClientById(clientId);
        if (!client) {
            throw new Error("Cliente no encontrado");
        }
        if(!client.typeMembership){
            throw new Error("El cliente no tiene un tipo de membresía asignado");
        }

        // registrar la membresía
        const membership = await Membership.create({
            clientId,
            startDate,
            endDate,
            price: client.typeMembership.price,
        });

        return membership;

        } catch (error) {
            throw new Error(`Error al pagar membresía: ${(error as Error).message}`);
        }

    }
}


export default new MembershipServices();
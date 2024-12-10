import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import membershipServices from "../services/membership/membership.services";

interface MembershipRequest extends Request {
    body: {
        userId: number;
        startDate: Date;
        endDate: Date;
    };
}

class MembershipController {
    async registerMembership(req: MembershipRequest, res: Response, next: NextFunction): Promise<void> {
        const {userId, startDate, endDate } = req.body;
        try {
            // Aquí iría la lógica para registrar la membresía
            const membership = await membershipServices.registerMembership(userId, startDate, endDate);
            res.status(201).json({
                membership,
                message: "Membresía registrada" });
        } catch (error) {
            next(createError(400, (error as Error).message));
        }
    }

    async getMembershipRemainingDays(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.body.userId;
        try {
            const infoRemainingDays = await membershipServices.getMembershipRemainingDays(userId);
            res.status(200).json( infoRemainingDays ); // devuelve: remainingDays, endDate, message
        } catch (error) {
            next(createError(400, (error as Error).message));
        }
    }
}


export default new MembershipController();
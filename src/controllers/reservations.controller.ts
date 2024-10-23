import { Request, Response, NextFunction } from "express";
import reservationsServices from "../services/reservations/reservations.services";
import createError from "http-errors";

class ReservationController {
  async createReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationsServices.createReservation(
        req.body
      );
      res.status(201).json(reservation);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getAllReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationsServices.getAllReservations();
      res.status(200).json(reservations);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new ReservationController();

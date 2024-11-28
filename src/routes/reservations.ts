import { Router, Request, Response } from "express";
import ReservationController from "../controllers/reservations.controller";

const router = Router();

router.post("/create", ReservationController.createReservation);
router.get("/", ReservationController.getAllReservations);

export { router };

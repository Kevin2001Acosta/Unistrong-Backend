// src/routes/membership.routes.ts
import { Router } from "express";
import membershipController from "../controllers/membership.controller";

const router = Router();

router.post("/register", membershipController.registerMembership);

export { router };
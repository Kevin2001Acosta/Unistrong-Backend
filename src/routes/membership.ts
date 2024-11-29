// src/routes/membership.routes.ts
import { Router } from "express";
import MembershipController from "../controllers/membership.controller";

const router = Router();

router.post("/register", MembershipController.registerMembership);
router.get("/info", MembershipController.getMembershipRemainingDays);

export { router };
// src/routes/membership.routes.ts
import { Router } from "express";
import MembershipController from "../controllers/membership.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = Router();
router.post("/register", verifyToken, MembershipController.registerMembership);
// MembershipPayments
router.post("/remainingDays", MembershipController.getMembershipRemainingDays);
export { router };

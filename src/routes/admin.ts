import { Router } from "express";
import adminController from "../controllers/admin.controller";

const router = Router();

router.post("/", adminController.createAdmin);
router.post("/createAny", adminController.createUserAnyType);
router.post("/assignCoach", adminController.assignCoachToClient);

export { router };

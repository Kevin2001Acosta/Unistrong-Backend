import { Router } from "express";
import adminController from "../controllers/admin.controller";

const router = Router();

router.post("/", adminController.createAdmin);
router.post("/coach", adminController.createCoach);
router.post("/nutri", adminController.createCNutri);
router.get("/coachinfo", adminController.getCoachInfo);
router.get("/nutriinfo", adminController.getNutriInfo);
router.get("/clientinfo", adminController.getClientInfo);

export { router };

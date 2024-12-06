import { Router } from "express";
import adminController from "../controllers/admin.controller";

const router = Router();

router.post("/", adminController.createAdmin);
router.post("/coach", adminController.createCoach);
router.post("/nutri", adminController.createCNutri);

export { router };

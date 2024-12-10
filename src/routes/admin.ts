import { Router } from "express";
import adminController from "../controllers/admin.controller";

const router = Router();

router.post("/", adminController.createAdmin);
<<<<<<< HEAD
router.post("/coach", adminController.createCoach);
router.post("/nutri", adminController.createCNutri);
router.get("/coachinfo", adminController.getCoachInfo);
router.get("/nutriinfo", adminController.getNutriInfo);
router.get("/clientinfo", adminController.getClientInfo);
=======
router.post("/createAny", adminController.createUserAnyType);
router.post("/assignCoach", adminController.assignCoachToClient);
router.post("/assignNutri", adminController.assignNutriToClient);
>>>>>>> master

export { router };

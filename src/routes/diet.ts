import { Router, Request, Response } from "express";
import DietController from "../controllers/diet.controller";

const router = Router();

router.post("/create", DietController.createDiet);
router.post("/assing", DietController.assignDietToClient);
router.get("/", DietController.getAllDiets);
router.post("/assingByEmail", DietController.assignDietByEmail);
router.get("/getDietByNutri/:id", DietController.getDietsByNutritionist);
router.get("/getDietByClient/:id", DietController.getDietsByClient);

export { router };

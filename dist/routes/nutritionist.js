import { Router } from "express";
import NutritionistController from "../controllers/nutritionist.controller";
const router = Router();
router.post("/register", NutritionistController.createNutritionist);
router.get("/", NutritionistController.getAllNutritionist);
export { router };

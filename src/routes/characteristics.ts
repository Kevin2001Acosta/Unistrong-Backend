import { Router } from "express";
import CharacteristicsController from "../controllers/characteristics.controller";

const router = Router();

router.post("/", CharacteristicsController.createCharacteristics);
router.get("/", CharacteristicsController.getAllCharacteristics);
router.get("/:id", CharacteristicsController.getCharacteristicsById);

export { router };

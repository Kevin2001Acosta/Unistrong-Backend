import { Router, Request, Response } from "express";
import ClassesController from "../controllers/classes.controler";

const router = Router();

router.post("/create", ClassesController.createClass);
router.get("/", ClassesController.getAllClasses);

export { router };

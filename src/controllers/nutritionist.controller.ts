import { Request, Response, NextFunction } from "express";
import NutritionistService from "../services/nutritionist/nutritionist.services";
import createError from "http-errors";

class NutritionistController {
  async createNutritionist(req: Request, res: Response, next: NextFunction) {
    try {
      const nutri = await NutritionistService.createNutritionist(req.body);
      res.status(201).json(nutri);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getAllNutritionist(req: Request, res: Response, next: NextFunction) {
    try {
      const nutri = await NutritionistService.getAllNutritionist();
      res.status(200).json(nutri);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new NutritionistController();

import { Request, Response, NextFunction } from "express";
import charactetisticsServices from "../services/characteristics/charactetistics.services";
import createError from "http-errors";

class CharacteristicsController {
  async createCharacteristics(req: Request, res: Response, next: NextFunction) {
    try {
      const characteristics =
        await charactetisticsServices.createCharacteristics(req.body);
      res.status(201).json(characteristics);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getAllCharacteristics(req: Request, res: Response, next: NextFunction) {
    try {
      const characteristics =
        await charactetisticsServices.getCharacteristics();
      res.status(200).json(characteristics);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getCharacteristicsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const characteristics =
        await charactetisticsServices.getCharacteristicsByClientId(
          Number(req.params.id)
        );
      res.status(200).json(characteristics);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new CharacteristicsController();

import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import ClassesService from "../services/classes/classes.services";

class ClassesController {
  async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await ClassesService.createClass(req.body);
      res.status(201).json(classes);
    } catch (error) {
      next(createHttpError(400, (error as Error).message));
    }
  }

  async getAllClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await ClassesService.getAllClasses();
      res.status(200).json(classes);
    } catch (error) {
      next(createHttpError(400, (error as Error).message));
    }
  }
}

export default new ClassesController();

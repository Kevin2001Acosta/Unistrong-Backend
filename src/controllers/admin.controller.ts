import { Request, Response, NextFunction } from "express";
import adminServices from "../services/admin/admin.services";
import createError from "http-errors";

class AdminController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await adminServices.createAdmin(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async createCoach(req: Request, res: Response, next: NextFunction) {
    try {
      const coach = await adminServices.createCoach(req.body);
      res.status(201).json(coach);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async createCNutri(req: Request, res: Response, next: NextFunction) {
    try {
      const coach = await adminServices.createNutri(req.body);
      res.status(201).json(coach);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new AdminController();

import { Request, Response, NextFunction } from "express";
import ClientService from "../services/client/client.services";
import createError from "http-errors";

class ClientController {
  async createClient(req: Request, res: Response, next: NextFunction) {
    try {
      const client = await ClientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getAllClients(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await ClientService.getAllClient();
      res.status(200).json(clients);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }
      const client = await ClientService.getClientById(clientId);
      res.status(200).json(client);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getUserByClientId(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }
      const user = await ClientService.getUserByClientId(clientId);
      res.status(200).json(user);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new ClientController();

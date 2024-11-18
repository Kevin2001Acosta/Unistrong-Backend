// controllers/client.controller.ts
import { Request, Response, NextFunction } from "express";
import ClientService from "../services/client/client.services";
import createError from "http-errors";

class ClientController {
  // Método para crear un nuevo cliente
  async createClient(req: Request, res: Response, next: NextFunction) {
    try {
      const client = await ClientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Método para obtener todos los clientes
  async getAllClients(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await ClientService.getAllClient();
      res.status(200).json(clients);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  // Método para obtener un cliente por ID
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

  // Método para obtener el usuario asociado a un cliente
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

  // Método para actualizar parcialmente los datos de un cliente
  async updateClient(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }

      // Llamar al servicio para actualizar los datos
      const updatedClient = await ClientService.updateClient(clientId, req.body);
      res.status(200).json(updatedClient);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}

export default new ClientController();

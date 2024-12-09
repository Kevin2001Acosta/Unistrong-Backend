import { Request, Response, NextFunction } from "express";
import ClientService from "../services/client/client.services";
import createError from "http-errors";

class ClientController {
  async createClient(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.user_id = req.body.userId;
      const client = await ClientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
  async fillClientFields(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.user_id = req.body.userId;
      const client = await ClientService.fillClientFields(req.body);
      res.status(200).json({
        message: "Campos de cliente actualizados",
        client,
      });
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
  // Nuevo método para actualizar campos parciales del cliente
  async updateClient(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = parseInt(req.params.id);
      if (isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }
      const updatedClient = await ClientService.updateClient(
        clientId,
        req.body
      );
      res.status(200).json(updatedClient);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async updateClientMembership(
    req: MembershipRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, idMembership } = req.body;
      if (isNaN(userId) || isNaN(idMembership)) {
        throw new Error(
          `ID de usuario: ${userId} o membresía inválido: ${idMembership}`
        );
      }
      const updatedClient = await ClientService.updateClientMembership(
        userId,
        idMembership
      );
      res.status(200).json(updatedClient);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }

  async getClientWithCoachAndUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const clientId = parseInt(req.params.id); // Obtener el ID del cliente desde los parámetros de la ruta

      if (isNaN(clientId)) {
        throw new Error("ID de cliente inválido");
      }

      // Llamada al servicio para obtener el cliente, coach y usuario asociados
      const client = await ClientService.getClientWithCoachAndUser(clientId);

      res.status(200).json(client);
    } catch (error) {
      next(createError(400, (error as Error).message));
    }
  }
}
interface MembershipRequest extends Request {
  body: {
    userId: number;
    idMembership: number;
  };
}

export default new ClientController();

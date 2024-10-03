//endpoints
import { Router, Request, Response } from "express";
import ClientService from "../services/client/client.services";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await ClientService.createClient(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await ClientService.getAllClient();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await ClientService.getClientById(Number(id));
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.get("/:id/user", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await ClientService.getUserByClientId(Number(id));
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: "Usuario no encontrado para este cliente." });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export { router };

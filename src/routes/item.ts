import { Request, Response, Router } from "express";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send({data: 'Aquí_van_los_modelos'});
});

export { router };

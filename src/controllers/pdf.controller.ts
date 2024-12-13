import { Request, Response, NextFunction } from "express";
import pdfGeneratorService from "../services/client/generatedPdf.services";

class StatisticsController { // controlador para generar pdf con imagenes del datos del cliente
  async generateStatisticsPDF(req: Request, res: Response, next: NextFunction) {
    try {
        const userId: number = parseInt(req.params.userId);
        const pdfBuffer = await pdfGeneratorService.generateStatisticsPDF(userId);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=statistics.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
  }
}

export default new StatisticsController();
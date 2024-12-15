import { Request, Response, NextFunction } from "express";
import pdfGeneratorService from "../services/client/generatedPdf.services";
import userServices from "../services/user/user.services";
import { EmailService } from "../services/email.service";

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
  async generateAndSendPDF(req: Request, res: Response, next: NextFunction){

    try{
      const userId: number = parseInt(req.params.userId);

      const pdfBuffer = await pdfGeneratorService.generateStatisticsPDF(userId);

      // obtener correo electrónico
      const user = await userServices.getUserById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // enviar correo electrónico
      const emailService: EmailService = new EmailService();

      await emailService.sendEmail({
        to: user.email,
        subject: "Estadísticas de cliente",
        text: "Estadísticas de cliente",
        attachments: [
          {
            filename: "statistics.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      res.status(200).json({ message: "Correo electrónico enviado correctamente con pdf" });

    }catch(error){
        next(error);
    }


  }
}

export default new StatisticsController();
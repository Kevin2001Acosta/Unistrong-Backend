import PDFDocument from "pdfkit";
import fs from "fs";
import statisticsService from "./statistics.services";
import { generateChart } from "../grafic.generator.services";
import clientServices from "./client.services";
import userServices from "../user/user.services";

class PDFGeneratorService {
  async generateStatisticsPDF(userId: number): Promise<Buffer> {

    const user = await userServices.getUserById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const client = await clientServices.getClientByUserId(userId);
    if (!client) {
      throw new Error("Cliente no encontrado");
    }

    const monthlyAverages = await statisticsService.getMonthlyAverages(client.id);

    const labels = monthlyAverages.map((data) => data.month);
    const weightData = monthlyAverages.map((data) => data.averageWeight);
    const legsData = monthlyAverages.map((data) => data.averageLegs);
    const armsData = monthlyAverages.map((data) => data.averageArms);

    const weightChart = await generateChart(weightData, labels, "Average Weight");
    const legsChart = await generateChart(legsData, labels, "Average Legs");
    const armsChart = await generateChart(armsData, labels, "Average Arms");

    const doc = new PDFDocument();
    const stream = fs.createWriteStream("output.pdf");
    doc.pipe(stream);

    // logo
    const logo = "assets/unistrong.jpg";
    doc.image(logo,doc.page.width-150, 20, {width: 100});

    const currentDate = new Date().toLocaleDateString();

    doc.fontSize(20).text("UNISTRONG", { align: "center" });
    doc.fontSize(20).text(currentDate, { align: "center" });
    doc.fontSize(20).text("Reporte de datos de peso, brazo y pierna", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Nombre: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Fecha de Nacimiento: ${client.birthDate.toLocaleDateString()}`);
    doc.text(`Altura: ${client.height} cm`);
    doc.moveDown();

    doc.image(weightChart, {
      fit: [500, 400],
      align: "center",
      valign: "center",
    });

    doc.addPage().image(legsChart, {
      fit: [500, 400],
      align: "center",
      valign: "center",
    });

    doc.addPage().image(armsChart, {
      fit: [500, 400],
      align: "center",
      valign: "center",
    });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => {
        resolve(fs.readFileSync("output.pdf"));
      });
      stream.on("error", reject);
    });
  }
}

export default new PDFGeneratorService();
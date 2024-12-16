"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const statistics_services_1 = __importDefault(require("./statistics.services"));
const grafic_generator_services_1 = require("../grafic.generator.services");
const client_services_1 = __importDefault(require("./client.services"));
const user_services_1 = __importDefault(require("../user/user.services"));
class PDFGeneratorService {
    generateStatisticsPDF(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_services_1.default.getUserById(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const client = yield client_services_1.default.getClientByUserId(userId);
            if (!client) {
                throw new Error("Cliente no encontrado");
            }
            const monthlyAverages = yield statistics_services_1.default.getMonthlyAverages(client.id);
            const labels = monthlyAverages.map((data) => data.month);
            const weightData = monthlyAverages.map((data) => data.averageWeight);
            const legsData = monthlyAverages.map((data) => data.averageLegs);
            const armsData = monthlyAverages.map((data) => data.averageArms);
            const weightChart = yield (0, grafic_generator_services_1.generateChart)(weightData, labels, "Average Weight");
            const legsChart = yield (0, grafic_generator_services_1.generateChart)(legsData, labels, "Average Legs");
            const armsChart = yield (0, grafic_generator_services_1.generateChart)(armsData, labels, "Average Arms");
            const doc = new pdfkit_1.default();
            const stream = fs_1.default.createWriteStream("output.pdf");
            doc.pipe(stream);
            // logo
            const logo = "assets/unistrong.jpg";
            doc.image(logo, doc.page.width - 150, 20, { width: 100 });
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
                    resolve(fs_1.default.readFileSync("output.pdf"));
                });
                stream.on("error", reject);
            });
        });
    }
}
exports.default = new PDFGeneratorService();

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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.userEmail = process.env.EMAIL_USER;
        this.passEmail = process.env.EMAIL_PASS;
        console.log(this.userEmail);
        console.log(this.passEmail);
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: this.userEmail,
                pass: this.passEmail,
            },
        });
    }
    sendEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ to, subject, text, attachments }) {
            yield this.transporter.sendMail({
                from: this.userEmail,
                to,
                subject,
                text,
                attachments,
            });
        });
    }
}
exports.EmailService = EmailService;

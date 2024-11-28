import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

export class EmailService {
  private transporter: Transporter;
  private userEmail?: string = process.env.EMAIL_USER;
  private passEmail?: string = process.env.EMAIL_PASS;

  constructor() {
    console.log(this.userEmail);
    console.log(this.passEmail);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.userEmail,
        pass: this.passEmail,
      },
    });
  }

  async sendEmail({to, subject, text}:EmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.userEmail,
      to,
      subject,
      text,
    });
  }
}
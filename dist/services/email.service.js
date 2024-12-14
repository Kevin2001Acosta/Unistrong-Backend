import nodemailer from 'nodemailer';
export class EmailService {
    transporter;
    userEmail = process.env.EMAIL_USER;
    passEmail = process.env.EMAIL_PASS;
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
    async sendEmail({ to, subject, text }) {
        await this.transporter.sendMail({
            from: this.userEmail,
            to,
            subject,
            text,
        });
    }
}

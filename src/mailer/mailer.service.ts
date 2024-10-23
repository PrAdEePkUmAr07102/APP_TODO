import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

  

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure:false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });  
    }


    async sendMail(to: string, subject:string, text: string) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return {message: "Mail Sended Successfully"};
        } catch (error) {
            console.log(error);
            throw new Error('Failed To Send Email');
        }
    }
}

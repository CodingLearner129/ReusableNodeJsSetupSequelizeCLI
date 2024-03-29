import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { dirname } from 'path';
import path from 'path';
import { convert } from 'html-to-text';
import configJs from './../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// new Email(user, url).sendWelcome();
export default class Email {
    constructor(user, url) {
        this.to = user.email,
            this.fullName = user.full_name,
            this.url = url,
            this.from = configJs.CONFIG.mail_from
    }

    newCreateTransport() {
        // if (process.env.NODE_ENV.trim() === "production") {
        //     // SENDGRID
        //     return nodemailer.createTransport({
        //         service: 'SendGrid', // we don't need to pass host and port if we use service
        //         auth: {
        //             user: process.env.SENDGRID_USERNAME,
        //             pass: process.env.SENDGRID_PASSWORD,
        //         }
        //     });
        // }
        // 1) Create a transporter
        return nodemailer.createTransport({
            host: configJs.CONFIG.mail_host,
            port: configJs.CONFIG.mail_port,
            auth: {
                user: configJs.CONFIG.mail_username,
                pass: configJs.CONFIG.mail_password,
            }
            // Activate in gmail "less secure app" option
        });
    }

    // Send the actual template
    async send(template, subject) {
        // 1) Render HTML based on a ejs template
        // res.render('');
        const templatePath = path.join(__dirname, `./../views/emails/${template}.ejs`);
        const templateString = fs.readFileSync(templatePath, 'utf8');

        const html = ejs.render(templateString, {
            fullName: this.fullName,
            subject: subject,
            url: this.url
        });

        // 2) Define email options
        const emailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html)
        }

        // 3) create a transport and send email
        await this.newCreateTransport().sendMail(emailOptions);
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to the Natours Family!");
    }

    async sendPasswordReset() {
        await this.send("passwordReset", "Your reset password token (valid for only 10 minutes)");
    }
}
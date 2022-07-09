import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from 'nodemailer';
import handlebars from "handlebars";
import fs from 'fs';
import { SES } from 'aws-sdk';

@injectable()
class SESMailProvider implements IMailProvider {
    private client: Transporter;
    constructor() {
        this.client = nodemailer.createTransport({
            SES: new SES({
                apiVersion: "2010-12-01",
                region: process.env.AWS_REGION
            }),
        });
    }
    async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const templateParse = handlebars.compile(templateFileContent);

        const templateHTML = templateParse(variables);

        //@ts-ignore
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        await this.client.sendMail({
            to,
            from: "Rentx <igorapalvesribeiro@gmail.com>",
            subject,
            html: templateHTML
        });     
    }

}

export { SESMailProvider };
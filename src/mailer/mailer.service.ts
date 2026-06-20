import { Injectable } from "@nestjs/common";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";

interface SendMailInterface {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class MailerService {
    async sendMail(params: SendMailInterface) {
        const client = new SESClient({ 
            credentials: { 
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : "",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : ""
            },
            region: "eu-north-1" 
        });

        const input = {
            Source: process.env.AWS_SOURCE_EMAIL, // required
            Destination: { // Destination
                ToAddresses: [ // AddressList
                    params.to
                ],
            },
            Message: { // Message
                Subject: { // Content
                    Data: params.subject, // required
                },
                Body: { // Body
                    Html: {
                        Data: params.html, // required
                    },
                },
            },
        };
        const command = new SendEmailCommand(input);

        await client.send(command);
    }
}



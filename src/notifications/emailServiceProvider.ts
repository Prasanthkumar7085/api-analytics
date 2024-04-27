import { Injectable } from "@nestjs/common";
import * as ejs from 'ejs';
import { salesRepsTargetsTemplate } from "src/views/email-templates/sales-reps-targets";
import { SESAPIDataServiceProvider } from "./sesAPIDataServiceProvider";
import { salesRepsUpdateTargetsNotifyTemplate } from "src/views/email-templates/update-targets";
import { monthlyTargetsUpdateTemplate } from "src/views/email-templates/montly-sales-targets-update-template";

@Injectable()
export class EmailServiceProvider {
    constructor(

        private readonly sESAPIDataServiceProvider: SESAPIDataServiceProvider

    ) {
        this.sendEmail = this.sendEmail.bind(this);
    }

    async sendEmail(emailData, emailContent, emailTemplate: any, ccList = []) {
        try {
            const emailRecepient = emailData.email;
            const emailSubject = emailData.subject;



            const emailBody = ejs.render(emailTemplate, emailContent);
            const toEmails = [emailRecepient];
            const ccEmails = ccList;

            var mailOptions = {
                from: "noreply@labsquire.com",
                to: toEmails,
                cc: ccEmails,
                subject: emailSubject,
                html: emailBody,
            };

            await this.sESAPIDataServiceProvider.sendEmail(mailOptions);
        } catch (error) {
            // TODO:: Error Log
            console.log(error);
        }
    }

    async sendEmailToEmails(emailData, emailContent, emailTemplate, ccList = []) {
        try {
            const emailSubject = emailData.subject;
            const toList = emailData.to;
            const emailBody = ejs.render(emailTemplate, emailContent);
            const ccEmails = ccList;

            const mailOptions = {
                from: "noreply@labsquire.com",
                to: toList,
                cc: ccEmails,
                subject: emailSubject,
                html: emailBody,
            };

            await this.sESAPIDataServiceProvider.sendEmail(mailOptions);
        } catch (error) {
            // TODO:: Error Log
            console.log(error);
        }
    }

    async sendSalesRepsTargetSummaryReport(emailData, emailContent) {

        this.sendEmail(emailData, emailContent, salesRepsTargetsTemplate);
    }

    async sendSalesRepsTargetVolumeUpdateNotification(emailData, emailContent) {



        this.sendEmail(emailData, emailContent, monthlyTargetsUpdateTemplate);
    }


}



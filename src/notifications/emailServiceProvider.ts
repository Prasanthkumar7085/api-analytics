import { Injectable } from "@nestjs/common";
import * as ejs from 'ejs';
import { monthlyTargetsOverviewTemplate } from "src/views/email-templates/monthly-target-overview-template";
import { monthlyTargetsUpdateTemplate } from "src/views/email-templates/montly-sales-targets-update-template";
import { SESAPIDataServiceProvider } from "./sesAPIDataServiceProvider";
import { Configuration } from "src/config/config.service";

@Injectable()
export class EmailServiceProvider {
    constructor(

        private readonly sESAPIDataServiceProvider: SESAPIDataServiceProvider,
        private readonly configuration: Configuration,


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

        let ccList = this.configuration.getConfig().emailSending ? this.configuration.getConfig().cc_emails : [];
        
        this.sendEmail(emailData, emailContent, monthlyTargetsOverviewTemplate, ccList);
    }

    async sendSalesRepsTargetVolumeUpdateNotification(emailData, emailContent) {

        this.sendEmail(emailData, emailContent, monthlyTargetsUpdateTemplate);
    }


}



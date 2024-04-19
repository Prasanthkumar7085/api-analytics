
import axios from 'axios';
import { CustomError } from 'src/middlewares/customValidationMiddleware';
import { Configuration } from 'src/config/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SESAPIDataServiceProvider {

    private config: any;

    constructor(
        private readonly configuration: Configuration

    ) {
        this.config = this.configuration.getConfig().kaka_email_service;
    }

    public async sendEmail(options) {

        try {

            const body = await this._parameters(options);

            const authToken = options.api_key || this.config.service_key;

            console.log("authToken", authToken);

            const headers = {
                'Authorization': "Bearer " + authToken
            };

            const config = {
                headers
            };


            await axios.post(this.config.api_base_url + '/notifications/sendEmail', body, config);

            console.log(" >> Email Sent to ", options.to.join(', '));
        }
        catch (err) {
            console.log(err);

            if (err.response) {
                throw this.getError(err.response);
            }
        }
    }


    private getError(errData) {


        if (errData.status == "401") {
            throw new CustomError(400, "No Auth to send Emails", "EMAILS_AUTH_FAIL");
        }

        const errCodeConfig = {
            "Application Error": "ok",
            "ValidationError": "ok"
        };

        if (errCodeConfig[errData.errName]) {
            throw new CustomError(400, "Error at uploading QuantStudio file", "ERROR_RESULT_FILE_UPLOAD");
        }
    }

    private async _parameters(options: any) {
        let returnData: any = {
            "message": {
                "body": {
                    "html": {
                        "charset": "UTF-8",
                        "data": options.html
                    }
                },
                "subject": {
                    "charset": "UTF-8",
                    "data": options.subject
                }
            },
            "toAddresses": options.to,
            "fromEmail": options.from,
        };

        if (options && options.replyTo) {
            returnData.replyTo = options.replyTo;
        }

        if (options && options.bcc && options.bcc.length) {
            returnData["bccAddresses"] = options.bcc;
        }
        if (options && options.cc && options.cc.length) {
            returnData["ccAddresses"] = options.cc;
        }
        return returnData;

    }

}

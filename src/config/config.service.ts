import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as dotenv from 'dotenv';
import * as fs from 'fs';



@Injectable()
export class Configuration {
    constructor(private readonly configService: ConfigService) {

        const envFilePath = `.env`;
        const existsPath = fs.existsSync(envFilePath);

        if (existsPath) {
            dotenv.config({ path: envFilePath });
        }
        else {
            console.log('Using .env.example file to supply config environment variables');
            dotenv.config({ path: '.env.example' });  // you can specify a default env file
        }
    }

    getConfig() {

        const lis_dlw_db_url = this.configService.get<string>('LIS_DLW_DB_URL');
        const lab_id = this.configService.get<string>('LAB_ID');
        const ls_api_key = this.configService.get<string>('LS_API_KEY');
        const lis_mgh_db_url = this.configService.get<string>('LIS_MGH_DB_URL');
        const jwt = {
            token_secret: "DRXqa9r4UsjO5F0wMybN2BdTiKGmzAoLs82jjj#wsjld",
            token_life: 604800, // in seconds - 1 Hr
            refresh_token_secret: "wXyjKsdjlj#12ZpuoDsmg1MLP8CaHkfO2bUhrF6W",
            refresh_token_life: 604800, // in seconds - 7 Days
            patient_portal_token_refresh_life: 60000,
        };

        const kaka_email_service = {
            service_key: this.configService.get<string>('KAKA_EMAIL_SERVICE_KEY'),
            api_base_url: this.configService.get<string>('KAKA_EMAIL_SERVICE_API_URL'),
            labsquire_from_mail: this.configService.get<string>('LABSQUIRE_FROM_EMAIL'),
        };

        return { lis_dlw_db_url, lab_id, ls_api_key, lis_mgh_db_url, jwt, kaka_email_service };
    }

}

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

        const lis_db_url = this.configService.get<string>('LIS_DB_URL');
        const lab_id = this.configService.get<string>('LAB_ID');
        const ls_api_key = this.configService.get<string>('LS_API_KEY')

        return { lis_db_url, lab_id, ls_api_key };
    }

}

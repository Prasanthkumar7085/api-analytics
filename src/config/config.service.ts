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
        return this.configService.get<string>('LIS_DB_URL');
    }
}

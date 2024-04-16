import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";
import { Configuration } from "src/config/config.service";



export class MghDbConnections {
    async connect() {
        const configuration = new Configuration(new ConfigService());
        const { lis_mgh_db_url } = configuration.getConfig();
        await mongoose.connect(lis_mgh_db_url);
    }
}
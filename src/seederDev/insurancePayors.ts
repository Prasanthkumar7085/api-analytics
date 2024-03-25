import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";
import { Configuration } from "src/config/config.service";



async function getInsurancePayers() {

    const configuration = new Configuration(new ConfigService());

    const mongoDb = configuration.getConfig()

    await mongoose.connect(mongoDb);

    const data = await CaseModel.find()

    console.log(data.length)

}
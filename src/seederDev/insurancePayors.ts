import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";
import { Configuration } from "../config/config.service";
import { InsurancePayorsModel } from "../schemas/insurancPayors";
import { insurance_payors } from "../drizzle/schemas/insurancePayors";
import { db } from "../seeders/db";
import { sql } from "drizzle-orm";



async function getInsurancePayors() {

    try {

        const configuration = new Configuration(new ConfigService());

        const { lis_dlw_db_url } = configuration.getConfig()

        await mongoose.connect(lis_dlw_db_url);

        //fetching data from insurance payors lis data
        const data = await InsurancePayorsModel.find().select('_id name')

        console.log(data);

        // console.log(data[0]);

        // Disconnect from MongoDB
        await mongoose.disconnect();

        return data;
    }
    catch (error) {
        console.error('Error:', error);
        await mongoose.disconnect();

        return null;
    }
}
// getInsurancePayors()

async function seedInsurancePayorsdata() {

    try {
        const data = await getInsurancePayors()

        const requiredData = data.map(insurance => {

            let dataToBeInserted = {
                name: insurance.name,
                refId: insurance._id.toString()
            }
            return dataToBeInserted;
        });

        console.log(requiredData);

        const result = await db.insert(insurance_payors).values(requiredData).returning();

        console.log(result);
        console.log('end')
    }
    catch (error) {
        console.error(error)
    }
}


// seedInsurancePayorsdata()

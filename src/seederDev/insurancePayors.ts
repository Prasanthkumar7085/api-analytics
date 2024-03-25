import { ConfigService } from "@nestjs/config";
import mongoose from "mongoose";
import { Configuration } from "../config/config.service";
import { InsuranceModel } from "../schemas/insurancPayors";
import { insurance_payors } from "../drizzle/schemas/insurancePayors";
import { db } from "../seeders/db";
import { sql } from "drizzle-orm";



async function getInsurancePayors() {

    try {

        const configuration = new Configuration(new ConfigService());

        const mongoDb = configuration.getConfig()

        await mongoose.connect(mongoDb);

        //fetching data from insurance payors lis data
        const data = await InsuranceModel.find().select('_id name')

        console.log(data.length);

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

async function getData() {

    const data = await db.execute(sql`SELECT * FROM insurance_payors`)

    console.log(data)
}

// getData()
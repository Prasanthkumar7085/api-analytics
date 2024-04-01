import { ConfigService } from '@nestjs/config';
import { sql } from 'drizzle-orm';
import mongoose from "mongoose";
import { Configuration } from '../config/config.service';
import { facilities } from '../drizzle/schemas/facilities';
import { HospitalModel } from '../schemas/hospitalSchema';
import { db } from '../seeders/db';



async function getFacilitiesData() {
    try {
        console.log('start');

        const configuration = new Configuration(new ConfigService());
        const { lis_db_url } = configuration.getConfig();

        await mongoose.connect(lis_db_url);

        //need to fetch hospitals data from lis
        const data = await HospitalModel.find()

        //disconnecting
        await mongoose.disconnect();

        return data

    } catch (err) {
        console.error("Error while connecting to mongoose", err);
        await mongoose.disconnect();
    }
}



async function seedFacilitiesData() {
    try {
        const data = await getFacilitiesData();

        //fetch sales-reps data
        // const salesRepsData = await db.select().from(sales_reps).where({ roleId: 1 });
        const salesRepsData = await db.execute(sql`SELECT id FROM sales_reps WHERE role_id = 1`)

        const sales = salesRepsData.rows;

        console.log(sales.length)

        const mappedData = data.map(item => {
            // Generate a random index
            const randomIndex = Math.floor(Math.random() * sales.length); //102 - length so (0-124)

            // Use the id at the random index as the salesRepId
            const salesRepId = Number(sales[randomIndex].id);

            return {
                name: item.name,
                refId: item._id.toString(),
                salesRepId: salesRepId
            }
        });

        console.log(mappedData);

        const result = await db.insert(facilities).values(mappedData).returning();

        console.log(result)
        console.log(result.length)
    }
    catch (error) {
        console.log(error)
    }
}

// seedFacilitiesData();


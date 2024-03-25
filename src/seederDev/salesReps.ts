import mongoose from 'mongoose';
import { Configuration } from '../config/config.service';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../schemas/userSchema';
import { sql } from 'drizzle-orm';
import { db } from '../seeders/db';
import { sales_reps } from '../drizzle/schemas/salesReps';



async function getSalesRepsData() {
    try {
        console.log('Fetching sales reps data...');

        // Create an instance of the Configuration class
        const configuration = new Configuration(new ConfigService());

        const mongoDb = configuration.getConfig();

        await mongoose.connect(mongoDb);

        // Fetch data from UserModel for MARKETER users
        const marketers = await UserModel.find({ user_type: "MARKETER" });

        console.log(`Total number of marketers: ${marketers.length}`);

        // Fetch manager IDs in bulk
        const managerIds = marketers
            .filter(marketer => marketer.hospital_marketing_manager && marketer.hospital_marketing_manager[0])
            .map(marketer => marketer.hospital_marketing_manager[0].toString());

        // Fetch manager data
        const managerData = await db.execute(sql`
            SELECT id, ref_id
            FROM sales_reps
            WHERE ref_id IN ${managerIds}
        `);

        console.log(managerData)

        const dataList = marketers.map(marketer => {
            let reportingTo = 2; // Default reportingTo value

            // Check if hospital_marketing_manager exists and has at least one item
            if (marketer.hospital_marketing_manager && marketer.hospital_marketing_manager.length > 0) {
                // Find corresponding manager data
                const manager = managerData.rows.find(row => row.ref_id === marketer.hospital_marketing_manager[0].toString());
                if (manager) {
                    reportingTo = manager.id as number;
                }
            }

            return {
                name: marketer.first_name,
                roleId: 1,
                reportingTo: reportingTo,
                refId: marketer._id.toString()
            };
        });

        console.log(dataList.length)
        console.log(dataList)

        //inserting into database
        const result = await db.insert(sales_reps).values(dataList).returning()
        console.log(result)

        // Disconnect from MongoDB
        await mongoose.disconnect();

        console.log('Sales reps data inserted successfully.');
    }
    catch (error) {
        console.error('Error:', error);
        await mongoose.disconnect();

    }
}

// Call the function
// getSalesRepsData();

console.log('End of script.');

import { Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { insurance_payors } from "src/drizzle/schemas/insurancePayors";
import { db } from "src/seeders/db";


@Injectable()
export class syncHelpers {

    async insertNewInsurancePayorsIntoAnalyticsDb(data) {
        // Extracting _id values from data
        const lisInsurancePayorsIdsArray = data.map(item => item._id.toString());

        // Fetching matching data from analytics db
        const matchingData = await db.execute(sql`SELECT ref_id FROM insurance_payors WHERE ref_id IN ${lisInsurancePayorsIdsArray}`);
        const pgInsurancePayorsIdsArray = matchingData.rows.map(item => item.ref_id);

        // Finding the difference
        const result = lisInsurancePayorsIdsArray.filter(item => !pgInsurancePayorsIdsArray.includes(item));

        console.log({ result })
        // Creating data to be inserted into analytics db
        // If there are new insurances to be inserted
        if (result.length > 0) {
            // Creating data to be inserted into analytics db
            const dataToBeInserted = data
                .filter(element => result.includes(element._id.toString()))
                .map(element => ({ name: element.name, refId: element._id.toString() }));

            console.log({ dataToBeInserted });
            // Inserting data into analytics db
            const response = await db.insert(insurance_payors).values(dataToBeInserted);

            console.log({ response });

            return dataToBeInserted;
        }
        return result;

    }

}
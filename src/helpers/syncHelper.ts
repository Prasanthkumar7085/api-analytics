import { Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { case_types } from "src/drizzle/schemas/caseTypes";
import { insurance_payors } from "src/drizzle/schemas/insurancePayors";
import { db } from "src/seeders/db";


@Injectable()
export class syncHelpers {


    getFromAndToDates(days: number) {
        const currentDate = new Date();
        const previousDate = new Date(currentDate);

        previousDate.setDate(currentDate.getDate() - days);

        // Set the time to the start of the day (00:00:00)
        previousDate.setUTCHours(0, 0, 0, 0);

        return {
            fromDate: previousDate,
            toDate: currentDate
        };
    }


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


    async insertNewCaseTypesIntoAnalyticsDb(data) {

        //need to check if case-type code is in the analytics db or not
        const lisCaseTypeCodesArray = data.map(item => item.code);

        // Fetching matching data from analytics db
        const matchingData = await db.execute(sql`SELECT * FROM case_types WHERE name IN ${lisCaseTypeCodesArray}`);

        const pgCasetypesArray = matchingData.rows.map(item => item.name)

        // Finding the difference
        const result = lisCaseTypeCodesArray.filter(item => !pgCasetypesArray.includes(item));


        if (result.length > 0) {
            // Creating data to be inserted into analytics db
            const dataToBeInserted = data
                .filter(element => result.includes(element.code))
                .map(element => ({ name: element.code, displayName: element.code }));

            console.log({ dataToBeInserted });
            // Inserting data into analytics db
            // const response = await db.insert(case_types).values(dataToBeInserted);
            // console.log({ response });

            return dataToBeInserted;
        }
        return result;
    }

}
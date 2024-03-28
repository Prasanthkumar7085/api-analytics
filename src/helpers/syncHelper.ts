import { Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { case_types } from "src/drizzle/schemas/caseTypes";
import { insurance_payors } from "src/drizzle/schemas/insurancePayors";
import { InsurancesV3Service } from "src/insurances-v3/insurances-v3.service";
import { db } from "src/seeders/db";


@Injectable()
export class syncHelpers {
    constructor(
        private readonly insurancesV3Service: InsurancesV3Service
    ) { }


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


    async modifyInsurancePayors(data) {
        // Extracting _id values from data
        const lisInsurancePayorsIdsArray = data.map(item => item._id.toString());

        // Fetching matching data from analytics db
        const matchingData = await db.execute(sql`SELECT ref_id FROM insurance_payors WHERE ref_id IN ${lisInsurancePayorsIdsArray}`);

        const pgInsurancePayorsIdsArray = matchingData.rows.map(item => item.ref_id);

        // Finding the difference
        const result = lisInsurancePayorsIdsArray.filter(item => !pgInsurancePayorsIdsArray.includes(item));

        const modifiedData = data
            .filter(element => result.includes(element._id.toString()))
            .map(element => ({ name: element.name, refId: element._id.toString() }));

        return modifiedData;
    }


    insertInsurancePayors(dataToBeInserted) {

        // Inserting data into analytics db
        this.insurancesV3Service.insertInsurancePayors(dataToBeInserted);

    }


    async modifyCaseTypes(data) {

        //need to check if case-type code is in the analytics db or not
        const lisCaseTypeCodesArray = data.map(item => item.code);

        // Fetching matching data from analytics db
        const matchingData = await db.execute(sql`SELECT * FROM case_types WHERE name IN ${lisCaseTypeCodesArray}`);

        const pgCasetypesArray = matchingData.rows.map(item => item.name);

        // Finding the difference
        const result = lisCaseTypeCodesArray.filter(item => !pgCasetypesArray.includes(item));

        return result;
    }


    insertCaseTypes(modifiedData, data) {

        // Creating data to be inserted into analytics db
        const dataToBeInserted = data
            .filter(element => modifiedData.includes(element.code))
            .map(element => ({ name: element.code, displayName: element.code }));

        console.log({ dataToBeInserted });
        // Inserting data into analytics db
        const response = db.insert(case_types).values(dataToBeInserted);
        console.log({ response })

        return dataToBeInserted;
    }


    getHospitalsWithNoManagers(facilitiesData, marketersData) {

        const facilitiesDataArray = facilitiesData.map(item => item._id.toString());

        const result = facilitiesDataArray.filter(item => !marketersData.includes(item));

        return result;
    }

}
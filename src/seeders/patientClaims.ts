import { sales_reps } from "../drizzle/schemas/salesReps";
import { facilities } from "../drizzle/schemas/facilities"
import { db } from "./db"
import { insurance_payors } from "../drizzle/schemas/insurancePayors";
import { case_types } from "../drizzle/schemas/caseTypes";
import { faker } from '@faker-js/faker';
import * as fs from 'fs'
import { patient_claims } from "../drizzle/schemas/patientClaims";
import { eq } from "drizzle-orm";


export default {
    seed: async (title) => {

        const fromDate = "2024-01-15T00:00:00.000Z";  //yyyy-mm-ddTHH-MM-ss.000Z
        const toDate = "2024-01-31T00:00:00.000Z";

        const resultArray = await prepareData(fromDate, toDate);
        // fs.writeFileSync('patient_claims_1.json', JSON.stringify(resultArray))

        console.log({ result: resultArray[0] });
        console.log({ resultArray: resultArray.length })


        // for (let i = 0; i < resultArray.length; i += 1500) {
        //     console.log(i)
        //     const chunk = resultArray.slice(i, i + 1500);

        //     await db.insert(patient_claims).values(chunk);
        // }

        console.log(title, "Data Seeded");
    }

}

async function prepareData(fromDate, toDate) {
    const facilitiesList = await db.select().from(facilities);
    const salesRepList = await db.select().from(sales_reps);
    const insurancesList = await db.select({ id: insurance_payors.id }).from(insurance_payors);

    const insuranceIdsArray = insurancesList.map((e) => e.id);

    const caseTypesList = await db.select({ id: case_types.id }).from(case_types);
    const caseTypesIdsArray = caseTypesList.map((e) => e.id);


    const iterations = 30;
    const resultArray = [];

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    console.log({ startDate, endDate });

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const date = new Date(currentDate); // Create a new date object
        // console.log({ date })

        for (let j = 0; j < facilitiesList.length; j++) {
            let patientClaims: any = {}; // Create a new patientClaims object for each iteration

            for (let i = 0; i < iterations; i++) {
                patientClaims = await getIdsandAmounts(patientClaims, facilitiesList[j], salesRepList, insuranceIdsArray, caseTypesIdsArray, date);
                resultArray.push(patientClaims);
            }
        }
    }

    return resultArray;
}

async function getIdsandAmounts(patientClaims, element, salesRepList, insuranceIdsArray, caseTypesIdsArray, currentDate) {

    const date = currentDate.toISOString().split('T')[0];

    patientClaims.facilityId = element.id;

    const salesRep = salesRepList.filter((e) => e.id === element.salesRepId)

    patientClaims.salesRepId = salesRep[0].id;

    patientClaims.insurancePayerId = faker.helpers.arrayElement(insuranceIdsArray);

    patientClaims.caseTypeId = faker.helpers.arrayElement(caseTypesIdsArray);

    const price = faker.commerce.price({ min: 100, max: 500, dec: 2 });

    patientClaims.expectedAmount = parseFloat(price);

    const billableAmount = faker.number.float({ min: 100, max: parseFloat(price), fractionDigits: 2 });
    patientClaims.billableAmount = billableAmount;

    const clearedAmount = faker.number.float({ min: 100, max: parseFloat(patientClaims.billableAmount), fractionDigits: 2 });
    patientClaims.clearedAmount = billableAmount

    const pendingAmount = patientClaims.billableAmount - patientClaims.clearedAmount;
    patientClaims.pendingAmount = parseFloat(pendingAmount.toFixed(2));

    patientClaims.insurnaceTargetPrice = 500;

    patientClaims.accessionId = faker.string.hexadecimal({ length: 10, casing: 'upper' });

    patientClaims.physicianId = faker.string.alphanumeric(24);

    patientClaims.patientId = faker.string.alphanumeric(24);

    patientClaims.serviceDate = date;

    patientClaims.collectionDate = date;

    const tempDate = new Date(currentDate.getTime()); // Clone currentDate without affecting the original
    const recentPaymentDate = new Date(tempDate.setDate(tempDate.getDate() + 3));

    patientClaims.recentPaymentDate = recentPaymentDate.toISOString().split('T')[0];


    // for all payments completed then uncomment the below code
    // patientClaims.isBillCleared = true;
    // patientClaims.reportsFinalized = true;

    return patientClaims;
}
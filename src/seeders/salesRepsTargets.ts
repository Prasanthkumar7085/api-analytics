import { sales_reps_monthly_targets } from '../../src/drizzle/schemas/salesRepsMonthlyTargets';
import { sales_reps_targets } from '../../src/drizzle/schemas/salesRepsTargets';
import { db } from './db';
import { faker } from '@faker-js/faker';


export default {
    seed: async (title) => {

        const batchSize = 50; // Define the batch size
        const data = await generateData();

        // Split data into batches
        for (let i = 0; i < data.length; i += batchSize) {
            const batchData = data.slice(i, i + batchSize);
            await insertBatch(batchData);
        }

        console.log(title, "Data Seeded");

    }

};

async function insertBatch(batchData) {
    try {

        await db.insert(sales_reps_monthly_targets).values(batchData).returning();
        console.log("Batch inserted successfully");
    } catch (error) {
        console.error("Error inserting batch:", error);
    }
}

async function generateData() {
    const data = [];

    const salesRepIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 18, 19, 20, 21, 22];

    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];


    for (let i = 0; i < salesRepIds.length; i++) {


        for (let j = 1; j < 5; j++) {

            const startDate = new Date(2024, j - 1, 1); // Month is zero-indexed
            const endDate = new Date(2024, j, 0); // Last day of the month

            const entry = {
                salesRepId: salesRepIds[i],
                startDate: await formatDate(startDate),
                endDate: await formatDate(endDate),
                month: await formateMonth(startDate),
                covid: 100,
                covidFlu: 100,
                clinical: 100,
                gastro: 100,
                nail: 100,
                pgx: 100,
                rpp: 100,
                tox: 100,
                ua: 100,
                uti: 100,
                wound: 100,
                card: 100,
                total: 1200,
                newFacilities: 2
            };

            data.push(entry);
        }

    }
    return data;
}


async function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function formateMonth(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${month}-${year}`;
}

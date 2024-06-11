import { sales_reps_monthly_targets } from '../../src/drizzle/schemas/salesRepsMonthlyTargets';
import { db } from './db';


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
        console.log("Batch inserted successfully", batchData);
    } catch (error) {
        console.error("Error inserting batch:", error);
    }
}

async function generateData() {
    const data = [];

    const salesRepIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]


    for (let i = 0; i < salesRepIds.length; i++) {


        for (let j = 1; j < 7; j++) {

            const startDate = new Date(2023, j - 1, 1); // Month is zero-indexed
            const endDate = new Date(2023, j, 0); // Last day of the month

            const entry = {
                salesRepId: salesRepIds[i],
                startDate: await formatDate(startDate),
                endDate: await formatDate(endDate),
                month: await formateMonth(startDate),
                covid: 0,
                covidFlu: 0,
                clinical: 0,
                gastro: 0,
                nail: 0,
                pgx: 0,
                rpp: 0,
                tox: 0,
                ua: 0,
                uti: 0,
                wound: 0,
                card: 0,
                total: 0,
                newFacilities: 0
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

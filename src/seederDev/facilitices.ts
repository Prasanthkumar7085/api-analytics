import { sql } from "drizzle-orm";
import { sales_reps } from "../drizzle/schemas/salesReps";
import { db } from "../seeders/db";
import { facilities } from "../drizzle/schemas/facilities";
import { insurance_payors } from "../drizzle/schemas/insurancePayors";
import { case_types } from "../drizzle/schemas/caseTypes";

async function seedFacilitiesData() {
    const data = await db.select().from(case_types)
    // .where(sql`role_id=1`).execute();

    // console.log(data)
    console.log(data.length)

    const a=100;
    for (let i = 0; i<a; i++) {

    }

}

// seedFacilitiesData()
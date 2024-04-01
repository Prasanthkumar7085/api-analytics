import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { case_types } from 'src/drizzle/schemas/caseTypes';
import { db } from 'src/seeders/db';

@Injectable()
export class CaseTypesService {

    async getAllCaseTypes(){
        return await db.select().from(case_types);
    }

    async getCaseTypeStatsData(queryString: string) {

        // this sql query is used to fetch the overall case type wise data
        // here round used to round the generated amount decial values to 2 decimal places
        // here cast is used to convert data type
        let statement = sql`
            SELECT 
                p.case_type_id,
                UPPER(c.name) AS case_type_name,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
                CAST(COUNT(DISTINCT(p.facility_id)) AS INTEGER) AS no_of_facilities,
                CAST(ROUND(SUM(p.billable_amount):: NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount):: NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount):: NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims p
            JOIN case_types c
                ON p.case_type_id = c.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                p.case_type_id,
                case_type_name
            ORDER BY
                case_type_name
        `;

        const data = await db.execute(statement);

        return data.rows;
    }


    async getCaseTypesMonthWiseRevenueData(queryString: string) {

        //this query is used to calculate revenue data grouped by month and case-type for overall case-types
        let statement = sql`
            SELECT
                p.case_type_id AS case_type_id,
                UPPER(c.name) AS case_type_name,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
            FROM patient_claims p
            JOIN case_types c
                ON p.case_type_id = c.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY
                TO_CHAR(service_date, 'Mon YYYY'),
                p.case_type_id,
                case_type_name
            ORDER BY
				TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY'),
                case_type_name
        `;

        const data = await db.execute(statement);

        return data.rows;
    }


    async getCaseTypesMonthWiseVolumeData(queryString: string) {

        //this query is used to calculate total no.of cases grouped by case-types and month for overall case-types
        let statement = sql`
            SELECT
                p.case_type_id AS case_type_id,
                UPPER(c.name) AS case_type_name,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN case_types c
                ON p.case_type_id = c.id
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY
                TO_CHAR(service_date, 'Mon YYYY'),
                p.case_type_id,
                case_type_name
            ORDER BY
				TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY'),
                case_type_name
        `;

        const data = await db.execute(statement);

        return data.rows;
    }


    async insertCaseTypes(data) {

        return await db.insert(case_types).values(data);
    }


    async getCaseTypes(lisCaseTypeCodesArray) {

        return await db.execute(sql`SELECT * FROM case_types WHERE name IN ${lisCaseTypeCodesArray}`);
    }
}



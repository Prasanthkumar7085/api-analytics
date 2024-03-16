import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class OverviewV3Service {

    async getRevenueStats(queryString: string) {

        // this sql query is used to calculate the overall generated, paid and pending amounts
        // here cast is used to convert data type
        // here round used to round the generated amount decial values to 2 decimal places
        let query = sql`
            SELECT 
                CAST(ROUND(SUM(billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        `;

        // to execute the query
        const data = await db.execute(query);

        return data.rows;
    }


    async getVolumeStats(queryString: string) {

        // this sql query is used to calculate overall total, completed and pending cases
        let query = sql`
            SELECT 
                CAST(COUNT(*) AS INTEGER) AS total_cases,
                CAST(COUNT(*) FILTER (WHERE is_bill_cleared = TRUE) AS INTEGER) AS completed_cases,
                CAST(COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        `;

        // Execute the query
        const data = await db.execute(query);

        return data.rows;
    }


    async getOverallCaseTypes(queryString: string) {

        // this sql query is used to calculate the case type wise total cases and total revenue
        let query = sql`
            SELECT 
                case_type_id,
                UPPER(c.name) AS case_type_name,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                p.case_type_id, 
                UPPER(c.name)
        `;

        // Execute the query
        const data = await db.execute(query);

        return data.rows;
    }


    async getOveriviewRevenueData(queryString: string) {

        // this sql query is used to calculate the overall revenue generated and paid amount
        let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Month YYYY') AS month,
                CAST(ROUND(SUM(billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
            FROM patient_claims
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                TO_CHAR(service_date, 'Month YYYY')
            ORDER BY 
                TO_DATE(TO_CHAR(service_date, 'Month YYYY'), 'Month YYYY')
        `;

        // Execute the query
        const data = await db.execute(query);

        return data.rows;
    }

}

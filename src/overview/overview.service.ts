import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class OverviewService {

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

        const data = await db.execute(query);

        return data.rows;
    }


    async getVolumeStats(queryString: string) {

        // this sql query is used to calculate overall total, completed and pending cases
        let query = sql`
            SELECT 
                CAST(COUNT(*) AS INTEGER) AS total_cases,
                CAST(COUNT(*) FILTER (WHERE reports_finalized = TRUE) AS INTEGER) AS completed_cases,
                CAST(COUNT(*) FILTER (WHERE reports_finalized = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        `;

        const data = await db.execute(query);

        return data.rows;
    }


    async getOverAllCaseTypesRevenue(queryString: string) {

        let query = sql`
            SELECT 
                c.id AS case_type_id,
                UPPER(c.display_name) AS case_type_name,
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
				CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                c.id, 
                UPPER(c.name)
            ORDER BY
                case_type_name
        `;

        const data = await db.execute(query);

        return data.rows;
    }


    async getOverAllCaseTypesVolume(queryString: string) {

        let query = sql`
            SELECT 
                c.id AS case_type_id,
                UPPER(c.display_name) AS case_type_name,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE p.reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                c.id, 
                UPPER(c.name)
            ORDER BY
                case_type_name
        `;

        const data = await db.execute(query);

        return data.rows;
    }


    async getOverviewRevenueData(queryString: string) {

        // this sql query is used to calculate the overall revenue generated and paid amount
        let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
            FROM patient_claims
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                TO_CHAR(service_date, 'Mon YYYY')
            ORDER BY 
                TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
        `;

        const data = await db.execute(query);

        return data.rows;
    }


    async getOverviewVolumeData(queryString: string) {

        // this sql query is used to calculate the overall revenue generated and paid amount
        let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE reports_finalized = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                TO_CHAR(service_date, 'Mon YYYY')
            ORDER BY 
                TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
        `;

        const data = await db.execute(query);

        return data.rows;
    }
}

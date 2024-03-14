import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class OverviewV3Service {
  
    async getStatsrevenue(queryString){

        let query=sql`
        SELECT 
            ROUND(SUM(billable_amount)::NUMERIC,2) AS generated_amount,
            ROUND(SUM(cleared_amount)::NUMERIC, 2) AS paid_amount,
            ROUND(SUM(pending_amount)::NUMERIC, 2) AS pending_amount
        FROM patient_claims`;

        if (queryString){
        query = sql`
        ${query}
        WHERE ${sql.raw(queryString)}`
        };

        const data = await db.execute(query);

        if (data && data.rows.length > 0) {
            return data.rows;
        } else {
            return [];
        }
    }


    async getStatsVolume(queryString){

        let query = sql`
            SELECT 
                COUNT(*) AS total_cases,
                COUNT(*) FILTER (WHERE is_bill_cleared = TRUE) AS completed_cases,
                COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS pending_cases
            FROM patient_claims
        `;


        if (queryString){
            query = sql`
                ${query}
                WHERE ${sql.raw(queryString)}
            `;
        };

        const data = await db.execute(query);

        if (data && data.rows.length > 0) {
            return data.rows;
        } else {
            return [];
        }
    }


    async getOverallCaseTypes(queryString){

        let query = sql`
            SELECT 
                case_type_id,
                UPPER(c.name) AS case_type_name,
                ROUND(SUM(cleared_amount)::NUMERIC, 2) AS revenue,
                (
                SELECT COUNT(*)
                FROM patient_claims
                ) AS volume
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
        `;


        if (queryString) {
            query = sql`
                ${query}
                WHERE ${sql.raw(queryString)}
            `;
        };

        query = sql`
            ${query}
            GROUP BY p.case_type_id, UPPER(c.name)
        `;


        const data = await db.execute(query);

        if (data && data.rows.length > 0) {
            return data.rows;
        } else {
            return [];
        }
    }

    async getRevenue(queryString){

        let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Month YYYY') AS month,
                ROUND(SUM(billable_amount)::NUMERIC, 2) AS generated_amount,
                ROUND(SUM(cleared_amount)::NUMERIC, 2) AS paid_amount
            FROM patient_claims
        `;


        if (queryString) {
            query = sql`
                ${query}
                WHERE ${sql.raw(queryString)}
            `;
        }

        query = sql`
            ${query}
            GROUP BY TO_CHAR(service_date, 'Month YYYY')
        `;

        const data = await db.execute(query);

        if (data && data.rows.length > 0) {
            return data.rows;
        } else {
            return [];
        }
    }

}

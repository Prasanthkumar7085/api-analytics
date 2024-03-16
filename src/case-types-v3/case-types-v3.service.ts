import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class CaseTypesV3Service {

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
                CAST(ROUND(SUM(p.billable_amount):: NUMERIC, 2) AS FLOAT) AS genereated_amount,
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
}

import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class CaseTypesV3Service {


    async getCaseTypeStats(queryString) {

        let statement = sql`
            SELECT 
                case_types.name AS case_type,
                COUNT(*) AS total_cases,
                COUNT(DISTINCT(facility_id)) AS facilities,
                ROUND(SUM(billable_amount):: NUMERIC, 2) AS  billed,
                ROUND(SUM(cleared_amount):: NUMERIC, 2) AS  received,
                ROUND(SUM(pending_amount):: NUMERIC, 2) AS  arrears
            FROM patient_claims
            JOIN case_types
                ON patient_claims.case_type_id = case_types.id
        `;

        if (queryString) {
            statement.append(sql`
                WHERE 
                ${sql.raw(queryString)}
            `);
        }

        statement.append(sql`
            GROUP BY case_type
        `);


        const data = await db.execute(statement);

        return data.rows;
    }
}

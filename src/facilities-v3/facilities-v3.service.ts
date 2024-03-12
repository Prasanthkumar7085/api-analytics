import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { facilities } from 'src/drizzle/schemas/facilities';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { db } from 'src/seeders/db';

@Injectable()
export class FacilitiesV3Service {


    async getStatsRevenue(id, queryString) {

        let statement = sql`
            SELECT     
                ROUND(SUM(billable_amount)::NUMERIC, 2) AS billed,
                ROUND(SUM(cleared_amount)::NUMERIC, 2) AS collected,
                ROUND(SUM(pending_amount)::NUMERIC, 2) AS pending
            FROM 
                patient_claims
            LEFT JOIN 
                facilities ON facilities.id = patient_claims.facility_id
            WHERE 
                facilities.id = ${id}
                `;

        if (queryString) {
            statement.append(sql`
                AND 
                ${sql.raw(queryString)}
            `)
        }

        statement.append(sql`
            GROUP BY 
            facilities.id;
        `);

        // Execute the raw SQL query
        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }
    }
}

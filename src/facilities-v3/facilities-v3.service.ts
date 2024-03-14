import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class FacilitiesV3Service {

    async getStatsRevenue(id, queryString) {

        let statement = sql`
            SELECT     
                ROUND(SUM(billable_amount)::NUMERIC, 2) AS generated_amount,
                ROUND(SUM(cleared_amount)::NUMERIC, 2) AS paid_amount,
                ROUND(SUM(pending_amount)::NUMERIC, 2) AS pending_amount
            FROM patient_claims
            LEFT JOIN facilities 
                ON facilities.id = patient_claims.facility_id
            WHERE facilities.id = ${id}
        `;

        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)}
            `;
        }

        statement = sql`
            ${statement}
            GROUP BY facilities.id;
        `;

        // Execute the raw SQL query
        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }
    }



    async getStatsVolume(id, queryString) {

        let statement = sql`
            SELECT
                COUNT(*) AS total_cases,
                COUNT(*) FILTER(WHERE is_bill_cleared = TRUE) AS completed_cases,
                COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS pending_cases
            FROM patient_claims
            WHERE facility_id = ${id}
        `;

        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)} 
            `;
        }

        const data = await db.execute(statement)

        return data.rows;
    }



    async getTrendsRevenue(id, queryString) {

        let statement = sql`
            SELECT 
                TO_CHAR(service_date, 'Month YYYY') AS month,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS revenue
            FROM patient_claims
            WHERE facility_id = ${id}
        `;


        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)}
            `;
        }

        statement = sql`
            ${statement}
            GROUP BY month
        `;

        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        } else {
            return [];
        }
    }



    async getTrendsVolume(id, queryString) {

        let statement = sql`
            SELECT 
                TO_CHAR(service_date, 'Month YYYY') AS month,
                COUNT(*) AS volume
            FROM patient_claims
            WHERE facility_id = ${id}
        `;

        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)}
            `;
        }

        statement = sql`
            ${statement}
            GROUP BY month
        `;

        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        } else {
            return [];
        }
    }



    async getCaseTypesVolume(id, queryString) {

        let statement = sql`
            SELECT 
                case_type_id,
                UPPER(c.name) AS case_type_name,
                TO_CHAR(service_date, 'Month YYYY') AS month,
                (
                SELECT COUNT(*)
                FROM patient_claims
                WHERE case_type_id = p.case_type_id AND facility_id = ${id}
                ) AS total_cases
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            WHERE facility_id = ${id}
        `;



        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)}
            `
        }

        statement = sql`
            ${statement}
            GROUP BY 
                case_type_id, 
                month, 
                case_type_name
        `

        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }
    }



    async getCaseTypesRevenue(id, queryString) {

        let statement = sql`
            SELECT 
                case_type_id,
                UPPER(c.name) AS case_type_name,
                TO_CHAR(service_date, 'Month YYYY') AS month,
                CAST(SUM(cleared_amount) AS NUMERIC(10, 2)) AS paid_amount
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            WHERE facility_id = ${id}
        `;

        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)}
            `;
        }

        statement = sql`
            ${statement}
            GROUP BY
                case_type_id,
                month,
                case_type_name
        `;

        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }
    }



    async getInsurancePayers(id, queryString) {

        let statement = sql`
            SELECT 
                insurance_payors.name AS insurance_name,
                ROUND(SUM(patient_claims.billable_amount)::NUMERIC, 2) AS generated_amount,
                ROUND(SUM(patient_claims.cleared_amount)::NUMERIC, 2) AS paid_amount,
                ROUND(SUM(patient_claims.pending_amount)::NUMERIC, 2) AS pending_amount
            FROM facilities
            JOIN patient_claims 
                ON patient_claims.facility_id = facilities.id
            JOIN insurance_payors 
                ON patient_claims.insurance_payer_id = insurance_payors.id
            WHERE facilities.id = ${id}
        `;

        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)}
            `;
        }


        statement = sql`
            ${statement}
            GROUP BY insurance_name
        `;

        // Execute the raw SQL query
        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }
    }


    async getOverAllCaseTypes(id, queryString) {

        let statement = sql`
            SELECT 
                case_type_id,
                UPPER(c.name) AS case_type_name,
                ROUND(SUM(cleared_amount):: NUMERIC, 2) AS revenue,
                (
                SELECT COUNT(*)
                FROM patient_claims
                WHERE case_type_id = p.case_type_id AND facility_id = ${id}
                ) 
                AS volume
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            WHERE facility_id = ${id}
        `;

        if (queryString) {
            statement = sql`
                ${statement}
                AND ${sql.raw(queryString)}
            `;
        }


        statement = sql`
            ${statement}
            GROUP BY 
                p.case_type_id,
                case_type_name
        `;


        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }
    }


    async getFacilityDetails(id) {
        let statement = sql`
            SELECT 
                f.id AS facility_id,
                UPPER(f.name) AS facility_name,
                sales_rep_id,
                UPPER(s.name) AS sales_rep_name
            FROM facilities f
            JOIN sales_reps s 
                ON f.sales_rep_id = s.id
            WHERE f.id = ${id}
            GROUP BY 
                f.sales_rep_id,
                facility_id,
                sales_rep_name,
                facility_name
        `;

        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }
    }


    async getAllFacilities(queryString) {
        let statement = sql`
            SELECT
                facilities.name AS facility_name,
                sales_reps.name AS sales_rep,
                ROUND(SUM(billable_amount):: NUMERIC, 2) as generated_amount,
                ROUND(SUM(cleared_amount):: NUMERIC, 2) as paid_amount,
                ROUND(SUM(pending_amount):: NUMERIC, 2) as pending_amount,
                COUNT(*) AS total_cases
            FROM patient_claims
            JOIN facilities 
                ON patient_claims.facility_id = facilities.id
            JOIN sales_reps
                ON patient_claims.sales_rep_id = sales_reps.id
        `;

        if (queryString) {
            statement = sql`
                ${statement}
                WHERE ${sql.raw(queryString)}
            `;
        }

        statement = sql`
            ${statement}
            GROUP BY
                sales_rep,
                facility_name
        `;


        const data = await db.execute(statement);

        if (data && data.rows.length > 0) {
            return data.rows;
        }
        else {
            return [];
        }

    }

}

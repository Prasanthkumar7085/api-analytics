import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class InsurancesV3Service {

    async getAllInsurancesData(queryString) {

        // this sql query is used to get the list of insurance payors and calculating the total cases, generated, paid and pending amounts
        // here cast is used to convert data type
        // here round used to round the generated amount decial values to 2 decimal places
        let query = sql`
            SELECT 
                insurance_payer_id,
                i.name as insurance_payor_name,
                CAST(COUNT(DISTINCT facility_id) AS INTEGER) AS no_of_facilities,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
                CAST(ROUND(SUM(billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_ammount,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims AS p
            JOIN insurance_payors i 
                ON p.insurance_payer_id = i.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                insurance_payer_id, i.name
        `;

        // Execute the query
        const data = await db.execute(query);

        return data.rows;
    }
    async getOneInsurancePayorDetails(id: any) {

        // this sql query is used to fetch insurance payor name.
        let query = sql`
            SELECT 
                name AS insurance_payor_name
            FROM insurance_payors
            WHERE id = ${id}
        `;

        const data = await db.execute(query);

        return data.rows;
    }


    async getInsurancePayorCaseTypeWiseData(id, queryString) {

        // this sql query is used to calculate the case type wise revenue data and cases volume data
        let query = sql`
            SELECT 
                case_type_id,
                UPPER(c.name) AS case_type_name,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
                CAST(COUNT(*) FILTER (WHERE is_bill_cleared = TRUE) AS INTEGER) AS completed_cases,
                CAST(ROUND(SUM(expected_amount)::NUMERIC, 2) AS FLOAT) AS expected_amount,
                CAST(ROUND(SUM(billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount,
                CAST(COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims p
            JOIN insurance_payors i 
                ON p.insurance_payer_id = i.id
            JOIN case_types c
                ON p.case_type_id = c.id
            WHERE p.insurance_payer_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                case_type_id,
                case_type_name
            ORDER BY
                case_type_id
        `;

        // Execute the query
        const data = await db.execute(query);

        return data.rows;
    }


    async getInsurancePayorRevenueTrends(id, queryString) {

        // this sql query is used to calculate the month wise revenue of a particular insurance payor
        // here order by is used to show the months in ascending order
        let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Month YYYY') AS month,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS revenue
            FROM patient_claims p
            JOIN insurance_payors i 
                ON p.insurance_payer_id = i.id
            WHERE p.insurance_payer_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                TO_CHAR(service_date, 'Month YYYY')
            ORDER BY
                TO_DATE(TO_CHAR(service_date, 'Month YYYY'), 'Month YYYY')
        `;

        // Execute the query
        const data = await db.execute(query);

        return data.rows;
    }


    async getInsurancePayorVolumeTrends(id, queryString) {

        // this sql query is used to calculate the month wise volume of a particular insurance payor
        let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Month YYYY') AS month,
                CAST(COUNT(*) AS INTEGER) AS volume
            FROM patient_claims p
            JOIN insurance_payors i 
                ON p.insurance_payer_id = i.id
            WHERE p.insurance_payer_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
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

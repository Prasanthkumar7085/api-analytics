import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { facilities } from 'src/drizzle/schemas/facilities';
import { sales_reps } from 'src/drizzle/schemas/salesReps';
import { db } from 'src/seeders/db';


@Injectable()
export class FacilitiesService {

    async getAllFacilitiesData() {
        return await db.select().from(facilities);
    }


    async getAllFacilitiesWithSalesRep(queryString) {
        const rawQuery = sql`
        SELECT f.id AS facility_id, f.name AS facility_name, sr.id AS sales_rep_id, sr.name AS sales_rep_name, sr.ref_id AS sales_rep_ref_id, sr.reporting_to AS sales_rep_reporting_to, sr.role_id AS sales_rep_role_id, sr.email AS sales_rep_email
        FROM facilities f
        LEFT JOIN sales_reps sr ON f.sales_rep_id = sr.id
        WHERE f.sales_rep_id IN (5, 8, 7, 6, 19, 2, 3, 4, 9, 10)
    `;

        const data = await db.execute(rawQuery);

        return data.rows;
    }


    async getAllFacilities(queryString: string) {

        // This query calculates the revenue_data and total no.of cases of facilities grouped by facility.
        // along with date filter on service date.
        let statement = sql`
                SELECT
                p.facility_id AS facility_id,
                f.name AS facility_name,
                sr.id AS sales_rep_id,
                sr.name AS sales_rep_name,
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN facilities f ON p.facility_id = f.id
            JOIN sales_reps sr ON p.sales_rep_id = sr.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY
                p.facility_id,
                f.name,
                sr.id,
                sr.name
            ORDER BY
                f.name,
                sr.name;
        `;


        const data = await db.execute(statement);

        return data.rows;

    }


    async getFacilityDetails(id: number) {

        // This query returns the facility_name and asociated sales_rep_name for a specific facility.
        let statement = sql`
            SELECT 
                f.id AS facility_id,
                UPPER(f.name) AS facility_name,
                sr.id AS sales_rep_id,
                UPPER(sr.name) AS sales_rep_name
            FROM facilities f
            JOIN sales_reps sr 
                ON f.sales_rep_id = sr.id
            WHERE f.id = ${id}
        `;

        const data = await db.execute(statement);

        return data.rows;
    }


    async getRevenueStats(id: number, queryString: string) {

        // This query calculated revenue data of a specific facility.
        let statement = sql`
            SELECT     
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims p
            LEFT JOIN facilities f
                ON f.id = p.facility_id
            WHERE f.id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
        `;

        // Execute the raw SQL query
        const data = await db.execute(statement);

        return data.rows;
    }


    async getVolumeStats(id: number, queryString: string) {

        // This query calculates no.of cases received for a specific facility.
        let statement = sql`
            SELECT
                CAST(COUNT(*) AS INTEGER) AS total_cases,
                CAST(COUNT(*) FILTER(WHERE reports_finalized = TRUE) AS INTEGER) AS completed_cases,
                CAST(COUNT(*) FILTER (WHERE reports_finalized = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims
            WHERE facility_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``};
        `;

        const data = await db.execute(statement);

        return data.rows;

    }


    async getOverAllCaseTypesRevenue(id: number, queryString: string) {

        // This query calculates the revenue data grouped by case-type of a specific facility.
        let query = sql`
			SELECT 
				p.case_type_id,
				UPPER(c.display_name) AS case_type_name,
				CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
				CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
			FROM patient_claims p
			JOIN case_types c
				ON p.case_type_id = c.id
			WHERE p.facility_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY
				p.case_type_id, 
				UPPER(c.display_name)
			ORDER BY
				case_type_name
		`;

        const data = await db.execute(query);

        return data.rows;
    }


    async getOverAllCaseTypesVolume(id: number, queryString: string) {

        // This query calculates the total no.of cases data grouped by case-type of a specific facility.
        let query = sql`
			SELECT 
				p.case_type_id,
				UPPER(c.display_name) AS case_type_name,
				CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE p.reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
			FROM patient_claims p
			JOIN case_types c
				ON p.case_type_id = c.id
			WHERE p.facility_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY
				p.case_type_id, 
				UPPER(c.display_name)
			ORDER BY
				case_type_name
		`;

        const data = await db.execute(query);

        return data.rows;
    }


    async getCaseTypesRevenue(id: number, queryString: string) {

        // This query calculates paid_amount grouped by case-type and month for a specific facility.
        let statement = sql`
            SELECT 
                p.case_type_id,
                UPPER(c.display_name) AS case_type_name,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            WHERE p.facility_id = ${id}
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


    async getCaseTypesVolume(id: number, queryString: string) {

        // This query calculates total_cases grouped by case-type and month for a specific facility.
        let statement = sql`
            SELECT
                p.case_type_id,
                UPPER(c.display_name) AS case_type_name,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            WHERE p.facility_id = ${id}
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

    async getInsurancePayersRevenue(id: number, queryString: string) {

        // This query calculates revenue data grouped by insurance for a specific facility.
        let statement = sql`
            SELECT
            	ip.id AS insurance_id, 
                ip.name AS insurance_name,
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims p
            JOIN insurance_payors ip 
                ON p.insurance_payer_id = ip.id
            WHERE p.facility_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                ip.id,
                insurance_name
            ORDER BY
                insurance_name
        `;

        const data = await db.execute(statement);

        return data.rows;
    }

    async getInsurancePayersVolume(id: number, queryString: string) {

        // This query calculates revenue data grouped by insurance for a specific facility.
        let statement = sql`
            SELECT
            	ip.id AS insurance_id, 
                ip.name AS insurance_name,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE p.reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims p
            JOIN insurance_payors ip 
                ON p.insurance_payer_id = ip.id
            WHERE p.facility_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY 
                ip.id,
                insurance_name
            ORDER BY
                insurance_name
        `;

        const data = await db.execute(statement);

        return data.rows;
    }


    async getOneInsuranceRevenueMonthWiseData(facilityId: number, payorId: number, queryString: string) {

        // this sql query is used to calculate the month wise revenue data of a particular insurance payor
        let query = sql`
            SELECT
                i.name AS insurance_payor_name,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
            FROM patient_claims p
            JOIN insurance_payors i
                ON p.insurance_payer_id = i.id
            WHERE facility_id = ${facilityId} 
                AND insurance_payer_id = ${payorId}
                ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY
                i.id,
                i.name,
                month
            ORDER BY
                TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
        `;

        const data = await db.execute(query);

        return data.rows;
    }


    async getRevenueTrends(id: number, queryString: string) {

        // This query calculates the paid_amount grouped by month for a specific facility.
        let statement = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
            FROM patient_claims
            WHERE facility_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY
                month
            ORDER BY
                TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
        `;

        const data = await db.execute(statement);

        return data.rows;
    }


    async getVolumeTrends(id: number, queryString: string) {

        // This query calculates the total_cases grouped by month for a specific facility.
        let statement = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims
            WHERE facility_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY    
				TO_CHAR(service_date, 'Mon YYYY')
            ORDER BY
                TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
        `;

        const data = await db.execute(statement);

        return data.rows;
    }


    async getFacilitiesRefIds(hospitalIds) {

        return await db.execute(sql`SELECT id, name, ref_id FROM facilities WHERE ref_id IN ${hospitalIds}`);
    }

    async getMghFacilitiesRefIds(hospitalIds) {

        return await db.execute(sql`SELECT id, name, mgh_ref_id FROM facilities`);
    }


    async insertfacilities(data) {

        return await db.insert(facilities).values(data).returning();
    }

    async updateMghFacilities(queryString) {
        const rawQuery = sql`
        UPDATE facilities AS t
        SET
          id = u.id,
          mgh_ref_id = u.mghRefId
        FROM(
          VALUES

        ${sql.raw(queryString)}
        ) as u(id, mghRefId)
        WHERE t.id = u.id`;

        return db.execute(rawQuery);
    }

    async updateDlwFacilities(queryString) {
        const rawQuery = sql`
        UPDATE facilities AS t
        SET
          id = u.id,
          name = u.name,
          ref_id = u.refId
        FROM(
          VALUES

        ${sql.raw(queryString)}
        ) as u(id, name, refId)
        WHERE t.id = u.id`;

        return db.execute(rawQuery);
    }

    async updateDlwFacilitiesData(queryString) {
        const rawQuery = sql`
        UPDATE facilities AS t
        SET
          id = u.id,
          ref_id = u.refId,
          updated_at = u.updatedAt
        FROM(
          VALUES

        ${sql.raw(queryString)}
        ) as u(id, refId, updatedAt)
        WHERE t.id = u.id`;

        return db.execute(rawQuery);
    }

    async updateMghFacilitiesData(queryString) {
        const rawQuery = sql`
        UPDATE facilities AS t
        SET
          id = u.id,
          mgh_ref_id = u.mghRefId,
          updated_at = u.updatedAt
        FROM(
          VALUES

        ${sql.raw(queryString)}
        ) as u(id, mghRefId, updatedAt)
        WHERE t.id = u.id`;

        return db.execute(rawQuery);
    }


    async updateDlwFacilitiesMapping(queryString){
        const rawQuery = sql`
        UPDATE facilities AS t
        SET
            sales_rep_id = u.sales_rep_id,
            updated_at = u.updatedAt
        FROM (
            VALUES
            ${sql.raw(queryString)}
        ) AS u(sales_rep_id, hospitals, updatedAt)
        WHERE 
            t.ref_id = ANY(u.hospitals);`;

        return db.execute(rawQuery);
    }


    async updateMghFacilitiesMapping(queryString){
        const rawQuery = sql`
        UPDATE facilities AS t
        SET
            sales_rep_id = u.sales_rep_id,
            updated_at = u.updatedAt
        FROM (
            VALUES
            ${sql.raw(queryString)}
        ) AS u(sales_rep_id, hospitals, updatedAt)
        WHERE 
            t.mgh_ref_id = ANY(u.hospitals);`;

        return db.execute(rawQuery);
    }
}

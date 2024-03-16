import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';


@Injectable()
export class FacilitiesV3Service {


	async getAllFacilities(queryString: string) {

		//this query aggregates the revenue_data and total cases for a facility
		let statement = sql`
            SELECT
                f.id,
                f.name AS facility_name,
                sr.name AS sales_rep,
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN facilities f
                ON p.facility_id = f.id
            JOIN sales_reps sr
                ON p.sales_rep_id = sr.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY
                f.id,
				facility_name,
                sales_rep
            ORDER BY
				facility_name,
                sales_rep
        `;

		const data = await db.execute(statement);

		return data.rows;

	}


	async getFacilityDetails(id: number) {

		let statement = sql`
            SELECT 
                f.id AS facility_id,
                UPPER(f.name) AS facility_name,
                sr.sales_rep_id,
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

		let statement = sql`
            SELECT     
                CAST(ROUND(SUM(billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims
            LEFT JOIN facilities 
                ON facilities.id = patient_claims.facility_id
            WHERE facilities.id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
        `;

		// Execute the raw SQL query
		const data = await db.execute(statement);

		return data.rows;
	}


	async getVolumeStats(id: number, queryString: string) {

		let statement = sql`
            SELECT
                CAST(COUNT(*) AS INTEGER) AS total_cases,
                CAST(COUNT(*) FILTER(WHERE is_bill_cleared = TRUE) AS INTEGER) AS completed_cases,
                CAST(COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims
            WHERE facility_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``};
        `;

		const data = await db.execute(statement);

		return data.rows;

	}


	async getOverAllCaseTypes(id: number, queryString: string) {

		let statement = sql`
            SELECT 
                p.case_type_id,
                UPPER(c.name) AS case_type_name,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(COUNT(*) AS INTEGER) AS volume
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
            WHERE p.facility_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY
                p.case_type_id,
                case_type_name
            ORDER BY
                p.case_type_id
        `;

		const data = await db.execute(statement);

		return data.rows;
	}


	async getCaseTypesRevenue(id: number, queryString: string) {

		let statement = sql`
            SELECT 
                p.case_type_id,
                UPPER(c.name) AS case_type_name,
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
                p.case_type_id
        `;

		const data = await db.execute(statement);

		return data.rows;
	}


	async getCaseTypesVolume(id: number, queryString: string) {

		let statement = sql`
            SELECT
                p.case_type_id,
                UPPER(c.name) AS case_type_name,
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
                p.case_type_id 
        `;

		const data = await db.execute(statement);

		return data.rows;
	}


	async getInsurancePayers(id: number, queryString: string) {

		let statement = sql`
            SELECT 
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
                insurance_name
            ORDER BY
                insurance_name
        `;

		const data = await db.execute(statement);

		return data.rows;
	}


	async getTrendsRevenue(id: number, queryString: string) {

		let statement = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS revenue
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


	async getTrendsVolume(id: number, queryString: string) {

		let statement = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(COUNT(*) AS INTEGER) AS volume
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

}

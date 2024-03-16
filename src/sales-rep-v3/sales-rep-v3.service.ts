import { Injectable } from '@nestjs/common';
import { db } from 'src/seeders/db';
import { sql } from 'drizzle-orm';


@Injectable()
export class SalesRepServiceV3 {


	async getAll(queryString: string) {

		//This query retrieves all sales reps and counts no_of_facilities there are in and counts total revenues and total cases
		let query = sql`
            SELECT
                p.sales_rep_id,
                s.name AS sales_rep_name,
                CAST(COUNT(DISTINCT p.facility_id) AS INTEGER) AS no_of_facilities,
                CAST(ROUND(SUM(p.expected_amount):: NUMERIC, 2) AS FLOAT) AS expected_amount,
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN sales_reps s 
                ON p.sales_rep_id = s.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
				p.sales_rep_id, 
				s.name
			ORDER BY
				p.sales_rep_id
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getOne(id: number) {

		//SELF JOIN
		let statement = sql`
			SELECT 
				sr.name AS sales_rep,
				m.name AS manager 
			FROM sales_reps sr
			JOIN sales_reps m 
				ON sr.reporting_to = m.id
			WHERE 
				sr.id = ${id}`;

		const result = await db.execute(statement);

		return result.rows;
	}


	async getRevenueStats(id: number, queryString: string) {

		let statement = sql`
            SELECT 
				CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
				CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims p
			WHERE p.sales_rep_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
		`;

		// Execute the raw SQL query
		const data = await db.execute(statement);

		return data.rows;
	}


	async getVolumeStats(id: number, queryString: string) {

		let query = sql`
			SELECT
				CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE is_bill_cleared = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS INTEGER) AS pending_cases
			FROM patient_claims
			WHERE sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``};
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getOverAllCaseTypes(id: number, queryString: string) {
		let query = sql`
            SELECT 
                p.case_type_id,
                UPPER(c.name) AS case_type_name,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(COUNT(*) AS INTEGER) AS volume
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
			WHERE p.sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY 
				p.case_type_id, 
				UPPER(c.name)
			ORDER BY
				case_type_name,
				p.case_type_id
        `;

		const data = await db.execute(query);

		return data.rows;

	}


	async getCaseTypesRevenue(id: number, queryString: string) {

		let query = sql`
            SELECT 
                p.case_type_id,
                UPPER(c.name) AS case_type_name,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
			WHERE p.sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY
				TO_CHAR(service_date, 'Mon YYYY'),
				p.case_type_id,
				case_type_name
			ORDER BY
				TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY'),
				p.case_type_id
        `;


		const data = await db.execute(query);

		return data.rows;
	}


	async getCaseTypesVolume(id: number, queryString: string) {

		let query = sql`
            SELECT 
                p.case_type_id,
                UPPER(c.name) AS case_type_name,
                TO_CHAR(p.service_date, 'Mon YYYY') AS month,
				CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN case_types c 
                ON p.case_type_id = c.id
			WHERE p.sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY 
				TO_CHAR(service_date, 'Mon YYYY'), 
				p.case_type_id, 
				case_type_name
			ORDER BY 
				TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY'),
				p.case_type_id 
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getInsurancePayers(id: number, queryString: string) {

		let statement = sql`
			SELECT 
				ip.id,
				ip.name AS insurance_name,
				CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
				CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
			FROM patient_claims p
            JOIN insurance_payors ip 
                ON p.insurance_payer_id = ip.id
            WHERE p.sales_rep_id = ${id}
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


	async getFacility(id: number, queryString: string) {
		let query = sql`
            SELECT 
                p.facility_id,
                f.name AS facility_name,
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount,
                CAST(COUNT(*) AS INTEGER) AS total_cases
            FROM patient_claims p
            JOIN facilities f 
                ON p.facility_id = f.id
			WHERE p.sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY
				p.facility_id,
				f.name	
			ORDER BY
				p.facility_id,
				f.name
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getRevenueTrends(id: number, queryString: string) {

		let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS revenue
            FROM patient_claims
			WHERE sales_rep_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
            GROUP BY
				TO_CHAR(service_date, 'Mon YYYY')
            ORDER BY
                TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getVolumeTrends(id: number, queryString: string) {

		let query = sql`
			SELECT 
				TO_CHAR(service_date, 'Mon YYYY') AS month,
				CAST(COUNT(*) AS INTEGER) AS volume
			FROM patient_claims
			WHERE sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY    
				TO_CHAR(service_date, 'Mon YYYY')
			ORDER BY
				TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async dropTable() {

		let query = sql`TRUNCATE TABLE patient_claims`;

		const data = await db.execute(query);

		return data;
	}


	async getPatientClaimsTotalCount(queryString) {

		let query = sql`
            SELECT 
                COUNT(*) AS count 
            FROM patient_claims
			${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
		`;

		const data = await db.execute(query);

		return data.rows;
	}


	async getOneInsuranceRevenue(sr_id: number, in_id: number, queryString: string) {

		let query = sql`
			SELECT 
				TO_CHAR(service_date, 'Mon YYYY') AS month,
				CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS revenue
			FROM 
				patient_claims
			WHERE 
				sales_rep_id = ${sr_id} 
				AND insurance_payer_id = ${in_id}
				${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY 
				TO_CHAR(service_date, 'Mon YYYY')
			ORDER BY 
				TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY');
		 `;

		const data = await db.execute(query);

		return data.rows;
	}

}

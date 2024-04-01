import { Injectable } from '@nestjs/common';
import { db } from '../seeders/db';
import { eq, sql } from 'drizzle-orm';
import { sales_reps } from 'src/drizzle/schemas/salesReps';


@Injectable()
export class SalesRepService {


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
				sales_rep_name
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getOne(id: number) {

		//SELF JOIN on sales-reps reporting_to to id
		let query = sql`
			SELECT 
				sr.name AS sales_rep,
				m.name AS manager 
			FROM sales_reps sr
			JOIN sales_reps m 
				ON sr.reporting_to = m.id
			WHERE 
				sr.id = ${id}`;

		const result = await db.execute(query);

		return result.rows;
	}


	async getRevenueStats(id: number, queryString: string) {

		//gets revenue statistics for a single sales rep
		let query = sql`
            SELECT 
				CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
				CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
            FROM patient_claims p
			WHERE p.sales_rep_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
		`;

		// Execute the raw SQL query
		const data = await db.execute(query);

		return data.rows;
	}


	async getVolumeStats(id: number, queryString: string) {

		// This query calculates the total number of cases for a specific sales representative. 
		let query = sql`
			SELECT
				CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE reports_finalized = FALSE) AS INTEGER) AS pending_cases
			FROM patient_claims
			WHERE sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``};
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getOverAllCaseTypesRevenue(id: number, queryString: string) {

		//This query calculates the total revenue statistics grouped by case type for a specific sales representative. 
		let query = sql`
			SELECT 
				p.case_type_id,
				UPPER(c.name) AS case_type_name,
				CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
				CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount
			FROM patient_claims p
			JOIN case_types c
				ON p.case_type_id = c.id
			WHERE p.sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY
				p.case_type_id, 
				UPPER(c.name)
			ORDER BY
				case_type_name
		`;

		const data = await db.execute(query);

		return data.rows;
	}


	async getOverAllCaseTypesVolume(id: number, queryString: string) {

		// This query calculates the total number of cases grouped by case type for a specific sales representative. 
		let query = sql`
			SELECT 
				p.case_type_id,
				UPPER(c.name) AS case_type_name,
				CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE p.reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
			FROM patient_claims p
			JOIN case_types c
				ON p.case_type_id = c.id
			WHERE p.sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY
				p.case_type_id, 
				UPPER(c.name)
			ORDER BY
				case_type_name
		`;

		const data = await db.execute(query);

		return data.rows;
	}


	async getCaseTypesRevenue(id: number, queryString: string) {

		// This query calculates the paid_amount grouped by month and case-type for a specific sales representative.
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
				TO_CHAR(p.service_date, 'Mon YYYY'),
				p.case_type_id,
				case_type_name
			ORDER BY
				TO_DATE(TO_CHAR(p.service_date, 'Mon YYYY'), 'Mon YYYY'),
				case_type_name
        `;


		const data = await db.execute(query);

		return data.rows;
	}


	async getCaseTypesVolume(id: number, queryString: string) {

		// This query calculates the total no.of cases, grouped by month and case-type for a specific sales representative.
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
				case_type_name 
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getInsurancePayers(id: number, queryString: string) {

		// This query calculates the revenue statistics grouped by insurance for a specific sales representative.
		let query = sql`
			SELECT 
				ip.id AS insurance_id,
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

		const data = await db.execute(query);

		return data.rows;
	}


	async getFacility(id: number, queryString: string) {

		// This query calculates the revenue data grouped by insurances for a specific sales representative.
		let query = sql`
            SELECT 
                f.id AS facility_id,
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
				f.id,
				f.name	
			ORDER BY
				f.name
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getRevenueTrends(id: number, queryString: string) {

		// This query calculates the paid_amount grouped by month for a specific sales representative.
		let query = sql`
            SELECT 
                TO_CHAR(service_date, 'Mon YYYY') AS month,
                CAST(ROUND(SUM(cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
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

		// This query calculates the total no.of cases grouped by month for a specific sales representative.
		let query = sql`
			SELECT 
				TO_CHAR(service_date, 'Mon YYYY') AS month,
				CAST(COUNT(*) AS INTEGER) AS total_cases
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

		// Thisq query deletes the data in patient_claims table in data base.
		let query = sql`TRUNCATE TABLE patient_claims`;

		const data = await db.execute(query);

		return data;
	}


	async getPatientClaimsTotalCount(queryString) {

		// This query calculates and return the total count of patient_claims in the db with data filter.
		let query = sql`
            SELECT 
                COUNT(*) AS count 
            FROM patient_claims
			${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
		`;

		const data = await db.execute(query);

		return data.rows;
	}


	async getOneInsuranceRevenue(srId: number, payorId: number, queryString: string) {

		// This query calculates the paid_amount of a specific insurance payor grouped by month for a specific sales representative.
		let query = sql`
			SELECT 
				i.id AS insurance_id,
				i.name AS insurance_name,
				TO_CHAR(p.service_date, 'Mon YYYY') AS month,
				CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount
			FROM 
				patient_claims p
			JOIN 
				insurance_payors i
					ON p.insurance_payer_id = i.id
			WHERE 
				p.sales_rep_id = ${srId} 
				AND p.insurance_payer_id = ${payorId}
				${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY 
				TO_CHAR(service_date, 'Mon YYYY'),
				i.id,
				i.name
			ORDER BY 
				TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
		`;

		const data = await db.execute(query);

		return data.rows;
	}


	async getMatchedSalesRepsIds(mappedSalesRepsIds) {

		return await db.execute(sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${mappedSalesRepsIds}`);
	}


	async getSalesRepsIdsAndRefIds(marketersIds) {

		const data = await db.execute(sql`SELECT id, ref_id FROM sales_reps WHERE ref_id IN ${marketersIds}`);

		return data.rows;
	}


	async insertSalesRepsManagers(data) {

		return await db.insert(sales_reps).values(data).returning();
	}


	async updateSalesRepsManagersData() {

		return await db.execute(sql`UPDATE sales_reps SET reporting_to = id WHERE reporting_to != id AND role_id = 2;`);
	}


	async insertSalesReps(finalData) {

		return await db.insert(sales_reps).values(finalData).returning();
	}

	async findOneSalesRep(refId) {
		return await db.select().from(sales_reps).where(eq(sales_reps.refId, refId));
	}

	async findSingleManagerSalesReps(reportingTo) {
		return await db.select().from(sales_reps).where(eq(sales_reps.reportingTo, reportingTo));
	}

	async getAllSalesReps() {
		return await db.select().from(sales_reps);
	}
}

import { Injectable } from '@nestjs/common';
import { db } from '../seeders/db';
import { and, eq, inArray, ne, sql } from 'drizzle-orm';
import { sales_reps } from 'src/drizzle/schemas/salesReps';
import { facilities } from 'src/drizzle/schemas/facilities';


@Injectable()
export class SalesRepService {


	async getAll(queryString: string) {

		//This query retrieves all sales reps and counts no_of_facilities there are in and counts total revenues and total cases
		let query = sql`
            SELECT
                p.sales_rep_id,
                s.name AS sales_rep_name,
				s.email AS email,
                CAST(COUNT(DISTINCT p.facility_id) AS INTEGER) AS active_facilities,
                CAST(ROUND(SUM(p.expected_amount):: NUMERIC, 2) AS FLOAT) AS expected_amount,
                CAST(ROUND(SUM(p.billable_amount)::NUMERIC, 2) AS FLOAT) AS generated_amount,
                CAST(ROUND(SUM(p.cleared_amount)::NUMERIC, 2) AS FLOAT) AS paid_amount,
                CAST(ROUND(SUM(p.pending_amount)::NUMERIC, 2) AS FLOAT) AS pending_amount,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims p
            JOIN sales_reps s 
                ON p.sales_rep_id = s.id
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY 
				p.sales_rep_id, 
				s.name,
				s.email
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
				m.name AS manager,
				sr.email as sales_rep_email 
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
				UPPER(c.display_name) AS case_type_name,
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
				UPPER(c.display_name)
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
				UPPER(c.display_name) AS case_type_name,
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
				UPPER(c.display_name)
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
                UPPER(c.display_name) AS case_type_name,
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
                UPPER(c.display_name) AS case_type_name,
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


	async getInsurancePayersRevenue(id: number, queryString: string) {

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


	async getInsurancePayersVolume(id: number, queryString: string) {

		// This query calculates the revenue statistics grouped by insurance for a specific sales representative.
		let query = sql`
			SELECT 
				ip.id AS insurance_id,
				ip.name AS insurance_name,
				CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE p.reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
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


	async getFacilitiesRevenue(id: number, queryString: string) {

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


	async getFacilitiesVolume(id: number, queryString: string) {

		// This query calculates the revenue data grouped by insurances for a specific sales representative.
		let query = sql`
            SELECT 
                f.id AS facility_id,
                f.name AS facility_name,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE p.reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
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


	async getFacilitiesVolumeMonthWise(id: number, queryString: string) {

		// This query calculates the revenue data grouped by insurances for a specific sales representative.
		let query = sql`
            SELECT 
                f.id AS facility_id,
                f.name AS facility_name,
				TO_CHAR(p.service_date, 'Mon YYYY') AS month,
                CAST(COUNT(*) AS INTEGER) AS total_cases,
				CAST(COUNT(*) FILTER(WHERE p.reports_finalized = TRUE) AS INTEGER) AS completed_cases,
				CAST(COUNT(*) FILTER (WHERE p.reports_finalized = FALSE) AS INTEGER) AS pending_cases
            FROM patient_claims p
            JOIN facilities f 
                ON p.facility_id = f.id
			WHERE p.sales_rep_id = ${id}
			${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
			GROUP BY
				TO_CHAR(p.service_date, 'Mon YYYY'),
				f.id,
				f.name	
			ORDER BY
				f.name
        `;

		const data = await db.execute(query);

		return data.rows;
	}


	async getFacilitiesRevenueMonthWise(id: number, queryString: string) {

		// This query calculates the revenue data grouped by insurances for a specific sales representative.
		let query = sql`
            SELECT 
                f.id AS facility_id,
                f.name AS facility_name,
				TO_CHAR(p.service_date, 'Mon YYYY') AS month,
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
				TO_CHAR(p.service_date, 'Mon YYYY'),
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

		const data = await db.execute(sql`SELECT ref_id FROM sales_reps WHERE ref_id IN ${mappedSalesRepsIds}`);
		return data.rows;
	}


	async getSalesRepsIdsAndRefIds(marketersIds) {

		const data = await db.execute(sql`SELECT id, ref_id FROM sales_reps WHERE ref_id IN ${marketersIds}`);

		return data.rows;
	}


	async getSalesRepsIdsAndMghRefIds(marketersIds) {

		const data = await db.execute(sql`SELECT id, mgh_ref_id FROM sales_reps WHERE mgh_ref_id IN ${marketersIds}`);

		return data.rows;
	}


	async getSalesRepsByMghRefIdsAndNames(ids, names) {
		const data = await db.execute(sql`
			SELECT id, name, mgh_ref_id
			FROM sales_reps
			WHERE mgh_ref_id IN (${sql.join(ids, sql`, `)})
			OR LOWER(name) IN (${sql.join(names.map(name => name.toLowerCase()), sql`, `)})
		`);
		
		return data.rows;
	}

	async getSalesRepsByRefIdsAndNames(ids, names) {
		const data = await db.execute(sql`
			SELECT id, name, ref_id
			FROM sales_reps
			WHERE ref_id IN (${sql.join(ids, sql`, `)})
			OR LOWER(name) IN (${sql.join(names.map(name => name.toLowerCase()), sql`, `)})
		`);
		
		return data.rows;
	}


	async getSalesRepsByMghRefIds(marketersIds) {

		const data = await db.execute(sql`SELECT id, mgh_ref_id, name FROM sales_reps WHERE mgh_ref_id IN ${marketersIds}`);

		return data.rows;
	}


	async insertSalesRepsManagers(data) {

		return await db.insert(sales_reps).values(data).returning();
	}


	async updateSalesRepsManagersData(ids) {
		return await db.execute(sql`UPDATE sales_reps SET reporting_to = id WHERE id IN ${ids};`);
	}


	async insertSalesReps(finalData) {

		return await db.insert(sales_reps).values(finalData).returning();
	}

	async findOneSalesRep(queryString) {
		const data = await db.execute(sql`SELECT * from sales_reps WHERE ${sql.raw(queryString)};`);
		return data.rows;
	}

	async getSalesRepsByManager(reportingTo) {
		return await db.select().from(sales_reps).where(eq(sales_reps.reportingTo, reportingTo));
	}

	async findSingleManagerSalesReps(reportingTo) {
		return await db.select().from(sales_reps).where(and(eq(sales_reps.reportingTo, reportingTo), ne(sales_reps.roleId, 3)));
	}


	async findMultiManagersSalesReps(reportingTo) {
		return await db.select().from(sales_reps).where(and(inArray(sales_reps.reportingTo, reportingTo), ne(sales_reps.roleId, 3)));
	}

	async getAllSalesReps() {
		return await db.select().from(sales_reps).orderBy(sales_reps.id);
	}


	async getSalesReps(queryString) {
		const rawQuery = sql`
		    SELECT * FROM sales_reps
		    ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
		`;
		const data = await db.execute(rawQuery);
		return data.rows;
	}

	async updateSalesReps(queryString) {
		const rawQuery = sql`
        UPDATE sales_reps AS t
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

	async getMghSalesRepsIdsAndRefIds(marketersIds) {

		const data = await db.execute(sql`SELECT id, mgh_ref_id FROM sales_reps WHERE mgh_ref_id IN ${marketersIds}`);

		return data.rows;
	}

	async getAllFacilitiesBySalesRep(salesRepId) {
		return db.select().from(facilities).where(eq(facilities.salesRepId, salesRepId));
	}

	async getAllFacilitiesCountBySalesRep(ids) {
		const data = await db.execute(sql`SELECT count(*) AS total_facilities, sales_rep_id FROM facilities WHERE sales_rep_id IN ${ids} GROUP BY sales_rep_id;`);
		return data.rows;
	}


	async getFacilityCountsByMonth(id: number, queryString: string) {
		let statement = sql`
        SELECT 
		    facility_id,
            TO_CHAR(service_date, 'Mon YYYY') AS month,
            COUNT(DISTINCT facility_id) AS total_facilities
        FROM patient_claims
        WHERE sales_rep_id = ${id}
        ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
        GROUP BY    
            TO_CHAR(service_date, 'Mon YYYY'),
			facility_id
        ORDER BY
            TO_DATE(TO_CHAR(service_date, 'Mon YYYY'), 'Mon YYYY')
    `;

		const data = await db.execute(statement);

		return data.rows;
	}


	async getOneSalesRepBySalesRepId(id: number) {

		//SELF JOIN on sales-reps reporting_to to id
		let query = sql`
			SELECT 
				sr.name AS name,
				sr.id,
				m.name AS manager,
				sr.email as email,
				sr.role_id as sales_rep_role_id 
			FROM sales_reps sr
			JOIN sales_reps m 
				ON sr.reporting_to = m.id
			WHERE 
				sr.id = ${id}`;

		const result = await db.execute(query);

		return result.rows;
	}

	async getSalesRepsByReportingTo(id: number) {
		const data = await db.execute(sql`SELECT * FROM sales_reps WHERE reporting_to = ${id}`);

		return data.rows;

	}


	async getVolumeStatsOfSalesReps(salesRepIds: any, queryString: string) {

		// This query calculates the total number of cases for a specific sales representative. 
		let query = sql`
				SELECT
					sales_rep_id,
					CAST(COUNT(*) AS INTEGER) AS total_cases,
					CAST(COUNT(*) FILTER(WHERE reports_finalized = TRUE) AS INTEGER) AS completed_cases,
					CAST(COUNT(*) FILTER (WHERE reports_finalized = FALSE) AS INTEGER) AS pending_cases
				FROM patient_claims
				WHERE sales_rep_id IN ${salesRepIds}
				${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
				GROUP BY sales_rep_id
				
			`;

		const data = await db.execute(query);

		return data.rows;
	}


	async getActiveSalesReps() {
		return db.select({ id: sales_reps.id }).from(sales_reps).where(eq(sales_reps.status, "ACTIVE"));
	}


	async updateManySalesReps(queryString) {
		const rawQuery = sql`
			UPDATE sales_reps AS t
			SET
			  name = u.name,
			  ref_id = u.refId,
			  email = u.email,
			  updated_at = u.updatedAt
			FROM(
			  VALUES
	
			${sql.raw(queryString)}
			) as u(name, refId, email, updatedAt)
			WHERE t.ref_id = u.refId`;

		return db.execute(rawQuery);
	}


	async updateManyMghSalesReps(queryString) {
		const rawQuery = sql`
			UPDATE sales_reps AS t
			SET
			  mgh_ref_id = u.mghRefId,
			  updated_at = u.updatedAt
			FROM(
			  VALUES
	
			${sql.raw(queryString)}
			) as u(id, mghRefId, updatedAt)
			WHERE t.id = u.id`;

		return db.execute(rawQuery);
	}


	async updateManySalesManagers(queryString) {
		const rawQuery = sql`
			UPDATE sales_reps AS t
			SET
			  name = u.name,
			  ref_id = u.refId,
			  email = u.email,
			  role_id = u.roleId,
			  reporting_to = u.reportingTo,
			  updated_at = u.updatedAt
			FROM(
			  VALUES
	
			${sql.raw(queryString)}
			) as u(id, name, refId, email, roleId, reportingTo, updatedAt)
			WHERE t.id = u.id`;

		return db.execute(rawQuery);
	}


	async updateManyMghSalesManagers(queryString) {
		const rawQuery = sql`
			UPDATE sales_reps AS t
			SET
			  mgh_ref_id = u.mghRefId,
			  role_id = u.roleId,
			  reporting_to = u.reportingTo,
			  updated_at = u.updatedAt
			FROM(
			  VALUES
	
			${sql.raw(queryString)}
			) as u(id, mghRefId, roleId, reportingTo, updatedAt)
			WHERE t.id = u.id`;

		return db.execute(rawQuery);
	}

}


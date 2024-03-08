import { Injectable } from '@nestjs/common';
import { db } from 'src/seeders/db';
import { sql } from 'drizzle-orm';

@Injectable()
export class SalesRepService {

  async getAll(queryString) {
    let query;
    query = sql`
      SELECT
      p.sales_rep_id,
      s.name AS sales_rep_name,
      COUNT(DISTINCT p.facility_id) AS no_of_facilities,
      CAST(SUM(p.expected_amount) AS NUMERIC(10, 2)) AS expected_amount,
      CAST(SUM(p.billable_amount) AS NUMERIC(10, 2)) AS total_amount,
      CAST(SUM(p.cleared_amount) AS NUMERIC(10, 2)) AS paid_amount,
      CAST(SUM(p.pending_amount) AS NUMERIC(10, 2)) AS pending_amount,
      (
        SELECT COUNT(*)
        FROM patient_claims
        WHERE sales_rep_id = p.sales_rep_id
    ) AS total
  FROM patient_claims p
  JOIN sales_reps s ON p.sales_rep_id = s.id`

    if (queryString) {
      query = sql`
        ${query}
        WHERE ${sql.raw(queryString)}
    `;
    }

    query = sql`
    ${query}
    GROUP BY p.sales_rep_id, s.name;`;

    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }
  }

  async getOverAllCaseTypes(id, queryString) {
    let query;
    query = sql`
    SELECT 
    case_type_id,
    UPPER(c.name) AS case_type_name,
    CAST(SUM(cleared_amount) AS NUMERIC(10, 2)) AS paid_amount,
    (
      SELECT COUNT(*)
      FROM patient_claims
      WHERE case_type_id = p.case_type_id AND sales_rep_id = ${id}
    ) AS total
    FROM patient_claims p
    JOIN case_types c ON p.case_type_id = c.id`;

    if(queryString){
      query = sql`
      ${query}
      WHERE sales_rep_id = ${id} AND ${sql.raw(queryString)}
      GROUP BY p.case_type_id, UPPER(c.name);
      `
    } else {
      query = sql`
      ${query}
      WHERE sales_rep_id = ${id}
      GROUP BY p.case_type_id, UPPER(c.name);
      `
    }

    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }

  }


  async getCaseTypesRevenue(id) {

    const query = sql`
    SELECT 
        case_type_id,
        UPPER(c.name) AS case_type_name,
        TO_CHAR(service_date, 'Month YYYY') AS month,
        CAST(SUM(cleared_amount) AS NUMERIC(10, 2)) AS paid_amount
    FROM patient_claims p
    JOIN case_types c ON p.case_type_id = c.id
    WHERE sales_rep_id = ${id}
    GROUP BY case_type_id, month, UPPER(c.name)
`;

    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }
  }


  async getCaseTypesVolume(id) {

    const query = sql`
    SELECT 
        case_type_id,
        UPPER(c.name) AS case_type_name,
        TO_CHAR(service_date, 'Month YYYY') AS month,
        (
          SELECT COUNT(*)
          FROM patient_claims
          WHERE case_type_id = p.case_type_id AND sales_rep_id = ${id}
        ) AS total_cases
    FROM patient_claims p
    JOIN case_types c ON p.case_type_id = c.id
    WHERE sales_rep_id = ${id}
    GROUP BY case_type_id, month, UPPER(c.name)
`;

    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }
  }


  async getFacilityWise(id) {
    const query = sql`
    SELECT 
        facility_id,
        f.name AS facility_name,
        CAST(SUM(billable_amount) AS NUMERIC(10, 2)) AS total_amount,
        CAST(SUM(cleared_amount) AS NUMERIC(10, 2)) AS paid_amount,
        CAST(SUM(pending_amount) AS NUMERIC(10, 2)) AS pending_amount,
        (
          SELECT COUNT(*)
          FROM patient_claims
          WHERE facility_id = p.facility_id AND sales_rep_id = ${id}
        ) AS total_cases
    FROM patient_claims p
    JOIN facilities f ON p.facility_id = f.id
    WHERE p.sales_rep_id = ${id}
    GROUP BY p.facility_id, f.name
    `;

    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }
  }

}

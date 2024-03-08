import { Injectable } from '@nestjs/common';
import { db } from 'src/seeders/db';
import { sql } from 'drizzle-orm';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { sales_reps } from 'src/drizzle/schemas/salesReps';
import { insurance_payors } from 'src/drizzle/schemas/insurancePayors';

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

    if (queryString) {
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



  async getStatsRevenue(id, query) {
    // Write raw SQL query to join and calculate totals
    let { from_date, to_date } = query;

    // Ensure that from_date and to_date are valid dates, if provided
    if (from_date) from_date = new Date(from_date);
    if (to_date) to_date = new Date(to_date);


    // Check if the provided id exists in the database
    // const salesRepExists = await db.execute(sql`
    //     SELECT COUNT(*) AS count
    //     FROM ${sales_reps}
    //     WHERE id = ${id}
    // `);

    // if (salesRepExists.rows.length === 0) {
    //   throw new NotFoundException('Sales Representative not found');
    // }


    // Build the SQL query with optional date filter
    let statement = sql`
      SELECT 
        ROUND(SUM(${patient_claims.billableAmount})::NUMERIC, 2) AS billed,
        ROUND(SUM(${patient_claims.clearedAmount})::NUMERIC, 2) AS collected,
        ROUND(SUM(${patient_claims.pendingAmount})::NUMERIC, 2) AS pending
      FROM 
        ${sales_reps}
      LEFT JOIN 
        ${patient_claims} ON ${sales_reps.id} = ${patient_claims.salesRepId}
      WHERE 
        ${sales_reps.id} = ${id}
    `;

    // Conditionally add the date filter if both from_date and to_date are provided
    if (from_date && to_date) {
      statement.append(sql`
        AND ${patient_claims.serviceDate} BETWEEN ${from_date} AND ${to_date}
      `);
    }

    statement.append(sql`
      GROUP BY 
        ${sales_reps.id};
    `);

    // Execute the raw SQL query
    const data = await db.execute(statement);

    return data.rows[0];
  }



  async getInsurancePayers(id, query) {

    let { from_date, to_date } = query;

    if (from_date) from_date = new Date(from_date);
    if (to_date) to_date = new Date(to_date);


    // const salesRepExists = await db.execute(sql`
    //     SELECT COUNT(*) AS count
    //     FROM ${sales_reps}
    //     WHERE id = ${id}
    // `);
    // console.log({ salesRepExists })
    // if (salesRepExists.rows.length === 0) {
    //   throw new NotFoundException('Sales Representative not found');
    // }


    let statement = sql`
    SELECT 
        ${insurance_payors.name} AS insurance_name,
        ROUND(SUM(${patient_claims.billableAmount})::NUMERIC, 2) AS total,
        ROUND(SUM(${patient_claims.clearedAmount})::NUMERIC, 2) AS paid,
        ROUND(SUM(${patient_claims.pendingAmount})::NUMERIC, 2) AS pending
    FROM ${sales_reps}
    JOIN ${patient_claims} ON ${patient_claims.salesRepId} = ${sales_reps.id}
    JOIN ${insurance_payors} ON ${patient_claims.insurancePayerId} = ${insurance_payors.id}
    WHERE ${sales_reps.id} = ${id}

    
    `;


    // Conditionally add the date filter if both from_date and to_date are provided
    if (from_date && to_date) {
      statement.append(sql`
        AND ${patient_claims.serviceDate} BETWEEN ${from_date} AND ${to_date}
      `);
    }

    statement.append(sql`
      GROUP BY 
        ${insurance_payors.name};
    `);

    // Execute the raw SQL query
    const data = await db.execute(statement);


    return data.rows;
  }


  async getCaseTypes(id: any) {
    const query = sql`
      SELECT *
      FROM patient_claims
      Wh`;

    const result = await db.execute(query);
    return result;
  }

  async getTrendsRevenue(id, fromDate, toDate) {
    let startDate, endDate;
    if (fromDate && toDate) {
      startDate = new Date(fromDate)
      endDate = new Date(toDate)
    }
    const query = sql`
      SELECT 
      TO_CHAR(service_date, 'Month YYYY') AS month,
      SUM(cleared_amount) AS revenue
      FROM patient_claims
      WHERE sales_rep_id = ${id}`

    if (fromDate && toDate) {
      query.append(sql`
      AND service_date BETWEEN ${startDate} AND ${endDate}
    `)
    }

    query.append(sql`
    GROUP BY TO_CHAR(service_date, 'Month YYYY');`)

    const result = await db.execute(query);
    return result
  }


  async getTrendsVolume(id, fromDate, toDate) {

    let startDate, endDate;
    if (fromDate && toDate) {
      startDate = new Date(fromDate)
      endDate = new Date(toDate)
    }
    const query = sql`
      SELECT 
      TO_CHAR(service_date, 'Month YYYY') AS month,
      COUNT(*) AS volume
      FROM patient_claims
      WHERE sales_rep_id = ${id}`

    if (fromDate && toDate) {
      query.append(sql`
      AND service_date BETWEEN ${startDate} AND ${endDate}
    `)
    }
    query.append(sql`
    GROUP BY TO_CHAR(service_date, 'Month YYYY');`)

    const result = await db.execute(query);
    return result
  }

}

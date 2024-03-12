import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class InsurancesV3Service {
  async getAllInsurances(queryString){
    
    let query = sql`
    SELECT 
      insurance_payer_id,
      i.name as insurance_payor_name,
      COUNT(DISTINCT facility_id) AS count_of_facilities,
      COUNT(*) AS total_cases,
      ROUND(SUM(billable_amount)::NUMERIC, 2) AS billed,
      ROUND(SUM(cleared_amount)::NUMERIC, 2) AS paid,
      ROUND(SUM(pending_amount)::NUMERIC, 2) AS pending
    FROM 
      patient_claims as p
    JOIN 
      insurance_payors i ON p.insurance_payer_id = i.id
    `
    if (queryString){
      query = sql`
        ${query}
        WHERE ${sql.raw(queryString)}
        GROUP BY 
          insurance_payer_id, i.name
      `
    } else {
      query = sql`
      ${query}
      GROUP BY 
        insurance_payer_id, i.name
      `
    }

    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }
  }


  async getOneInsurancePayorData(id, queryString) {
    let query = sql`
    SELECT 
      UPPER(c.name) AS case_type_name,
      COUNT(*) AS total_cases,
      COUNT(*) FILTER (WHERE is_bill_cleared = TRUE) AS completed_cases,
      ROUND(SUM(expected_amount)::NUMERIC, 2) AS expected_amount,
      ROUND(SUM(billable_amount)::NUMERIC, 2) AS billed_amount,
      ROUND(SUM(cleared_amount)::NUMERIC, 2) AS paid_amount,
      ROUND(SUM(pending_amount)::NUMERIC, 2) AS pending_amount,
      COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS pending_cases
    FROM 
      patient_claims p
    JOIN 
      insurance_payors i ON p.insurance_payer_id = i.id
    JOIN 
      case_types c ON p.case_type_id = c.id
    `;
    if (queryString) {  
      query = sql`
      ${query}
      WHERE 
        p.insurance_payer_id = ${id} AND ${sql.raw(queryString)}
      GROUP BY 
        c.name;
      `
    } else {
      query = sql`
      ${query}
      WHERE 
        p.insurance_payer_id = ${id}
      GROUP BY 
        c.name;
      `;
    }

    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
        return data.rows;
    } else {
        return [];
    }
  }

}

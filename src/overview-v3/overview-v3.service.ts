import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { db } from 'src/seeders/db';

@Injectable()
export class OverviewV3Service {
  
  async getStatsrevenue(queryString){
  let query=sql`
  SELECT 
  ROUND(SUM(billable_amount)::NUMERIC,2) AS billed,
  ROUND(SUM(cleared_amount)::NUMERIC, 2) AS paid,
  ROUND(SUM(pending_amount)::NUMERIC, 2) AS pending
  FROM patient_claims
  `

  if (queryString){
    query = sql`
    ${query}
    WHERE ${sql.raw(queryString)}`
  }
  const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }

  }
  async getStatsVolume(queryString){
    let query = sql`
    SELECT 
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE is_bill_cleared = TRUE) AS completed_cases,
    COUNT(*) FILTER (WHERE is_bill_cleared = FALSE) AS pending_cases
    FROM patient_claims
    `
    if (queryString){
      query = sql`
      ${query}
      WHERE ${sql.raw(queryString)}`
    }
    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }
  }

}

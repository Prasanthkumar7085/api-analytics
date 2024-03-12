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
    GROUP BY 
      insurance_payer_id, i.name
    `
    const data = await db.execute(query);

    if (data && data.rows.length > 0) {
      return data.rows;
    } else {
      return [];
    }
  }
}

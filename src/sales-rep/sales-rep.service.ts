import { Injectable } from '@nestjs/common';
import { db } from 'src/seeders/db';
import { sql } from 'drizzle-orm';

@Injectable()
export class SalesRepService {

  async getCaseTypes(id:any){
    const query = sql`
      SELECT *
      FROM patient_claims
      Wh`;

    const result = await db.execute(query);
    return result;
  }

  async getTrendsRevenue(id,fromDate,toDate){
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
      
    if (fromDate&&toDate){
      query.append(sql`
      AND service_date BETWEEN ${startDate} AND ${endDate}
    `)
    }
    
    query.append(sql`
    GROUP BY TO_CHAR(service_date, 'Month YYYY');`)
      
    const result = await db.execute(query);
    return result
  }


  async getTrendsVolume(id,fromDate,toDate){

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

    if (fromDate&&toDate){
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

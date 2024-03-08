import { Injectable } from '@nestjs/common';
import { CreateSalesRepDto } from './dto/create-sales-rep.dto';
import { UpdateSalesRepDto } from './dto/update-sales-rep.dto';
import { db } from 'src/seeders/db';
import { sales_reps } from 'src/drizzle/schemas/salesReps';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class SalesRepService {
  // salesReps = db.select().from(sales_reps)


  // async getCaseTypes(id:any){
  //   const data = await db.select().from(patient_claims).where(eq(patient_claims.salesRepId, id))
  //   const resultArray = []
    
  //   data.forEach(item => {
  //     const case_type = item.caseTypeId
  //     const revenue = item.clearedAmount

  //     const existingCaseType = resultArray.find(caseItem => caseItem.case_type === case_type);
  //     if (existingCaseType){
  //       existingCaseType.revenue += revenue
  //     }else{
  //       resultArray.push({case_type:case_type, revenue:revenue})
  //     }

  //   })
  //   return resultArray
  // }

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

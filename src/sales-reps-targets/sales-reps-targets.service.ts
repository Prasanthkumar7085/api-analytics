import { Injectable } from '@nestjs/common';
import { sales_reps_targets } from 'src/drizzle/schemas/salesRepsTargets';
import { db } from '../seeders/db';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { sql } from 'drizzle-orm';

@Injectable()
export class SalesRepsTargetsService {

  async getAllSalesRepsTargets() {
    let query = sql`
        SELECT 
            s.name AS sales_rep_name,
            srt.sales_rep_id,
            srt.year,
            srt.jan,
            srt.feb,
            srt.mar,
            srt.april,
            srt.may,
            srt.june,
            srt.july,
            srt.aug,
            srt.sep,
            srt.oct,
            srt.nov,
            srt.dec
        FROM 
            sales_reps_targets srt
        JOIN 
            sales_reps s ON srt.sales_rep_id = s.id
    `;

    const data = await db.execute(query);

    return data.rows;
  }



}



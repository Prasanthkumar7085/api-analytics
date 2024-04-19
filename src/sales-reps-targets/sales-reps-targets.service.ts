import { Injectable } from '@nestjs/common';
import { sales_reps_targets } from 'src/drizzle/schemas/salesRepsTargets';
import { db } from '../seeders/db';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { sql, eq } from 'drizzle-orm';
import { UpdateSalesRepTargetsDto } from './dto/update-sales-reps-target.dto';

@Injectable()
export class SalesRepsTargetsService {

  async getAllSalesRepsTargets(year: number) {
    let query = sql`
        SELECT 
            srt.id,
            s.name AS sales_rep_name,
            srt.sales_rep_id,
            srt.year,
            srt.jan,
            srt.feb,
            srt.mar,
            srt.apr,
            srt.may,
            srt.jun,
            srt.jul,
            srt.aug,
            srt.sept,
            srt.oct,
            srt.nov,
            srt.dec
        FROM 
            sales_reps_targets srt
        JOIN 
            sales_reps s ON srt.sales_rep_id = s.id
        WHERE
            srt.year = ${year}
        ORDER BY
				    s.name
    `;

    const data = await db.execute(query);

    return data.rows;
  }

  async getOneSalesRepTargetDataById(id: number) {
    return await db.select()
      .from(sales_reps_targets)
      .where(eq(sales_reps_targets.id, id))
      .execute();
  }

  async updateSalesRepsTargets(id: number, salesRepTargetDto: UpdateSalesRepTargetsDto) {

    const { month, targets_data } = salesRepTargetDto;

    const targetsDataJson = JSON.stringify(targets_data);

    const rawQuery = sql`
        UPDATE sales_reps_targets
        SET ${sql.raw(month)} =  ${targetsDataJson}::jsonb
        WHERE id = ${id}
    `;

    return await db.execute(rawQuery);
  }


  async getAllSalesRepsTargetsData() {
    return await db.select().from(sales_reps_targets).orderBy(sales_reps_targets.id);
  }


}



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

  // async updateSalesRepsTargets(id: number, salesRepTargetDto: UpdateSalesRepTargetsDto) {

  //   const month = salesRepTargetDto.month as string;

  //   const rawQuery = sql`
  //   UPDATE sales_reps_targets
  //   SET ${month}[1] = ${sql.raw(salesRepTargetDto.target_volume)},
  //       ${month}[2] = ${sql.raw(salesRepTargetDto.target_facilities)}
  //   WHERE sales_rep_id = ${id}
  //   AND year = ${salesRepTargetDto.year}
  // `;

  //   return db.execute(rawQuery);
  // }


}



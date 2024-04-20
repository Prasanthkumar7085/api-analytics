import { Injectable } from '@nestjs/common';
import { sales_reps_targets } from 'src/drizzle/schemas/salesRepsTargets';
import { sales_reps_monthly_targets } from 'src/drizzle/schemas/salesRepsMonthlyTargets';
import { db } from '../seeders/db';
import { patient_claims } from 'src/drizzle/schemas/patientClaims';
import { sql, eq } from 'drizzle-orm';
import { UpdateSalesRepTargetsDto } from './dto/update-sales-reps-target.dto';

@Injectable()
export class SalesRepsTargetsService {

  async getAllSalesRepsTargets(queryString) {
    let query = sql`
        SELECT 
            srt.id,
            s.name AS sales_rep_name,
            srt.sales_rep_id,
            srt.start_date,
            srt.end_date,
            srt.month,
            srt.covid,
            srt.covid_flu,
            srt.clinical,
            srt.gastro,
            srt.nail,
            srt.pgx,
            srt.rpp,
            srt.ua,
            srt.tox,
            srt.uti,
            srt.wound,
            srt.card,
            srt.cgx,
            srt.diabetes,
            srt.pad,
            srt.pul,
            srt.total,
            srt.new_facilities,
            srt.created_at,
            srt.updated_at

        FROM 
            sales_reps_monthly_targets srt
        JOIN 
            sales_reps s ON srt.sales_rep_id = s.id
         ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        ORDER BY
				    s.name,
            srt.start_date

    `;

    const data = await db.execute(query);

    return data.rows;
  }

  async getOneSalesRepTargetDataById(id: number) {
    return await db.select()
      .from(sales_reps_monthly_targets)
      .where(eq(sales_reps_monthly_targets.id, id))
      .execute();
  }

  async updateSalesRepsTargets(id: number, salesRepTargetDto: UpdateSalesRepTargetsDto) {

    const { covid, covid_flu, clinical, gastro, nail, pgx, rpp, tox, ua, uti, wound, card, cgx, diabetes, pad, pul } = salesRepTargetDto;

    const rawQuery = sql`
        UPDATE sales_reps_monthly_targets
        SET 
            covid = ${covid},
            covid_flu = ${covid_flu},
            clinical = ${clinical},
            gastro = ${gastro},
            nail = ${nail},
            pgx = ${pgx},
            rpp = ${rpp},
            tox = ${tox},
            ua = ${ua},
            uti = ${uti},
            wound = ${wound},
            card = ${card},
            cgx = ${cgx},
            diabetes = ${diabetes},
            pad = ${pad},
            pul = ${pul}

        WHERE id = ${id}
    `;

    return await db.execute(rawQuery);
  }



  async getAllSalesRepsTargetsData() {
    return await db.select().from(sales_reps_monthly_targets).orderBy(sales_reps_targets.id);
  }


  async getSalesRepTargets(queryString) {
    const rawQuery = sql`
		select * from sales_reps_targets
		${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
		`;
    const data = await db.execute(rawQuery);

    return data.rows;
  }

  async insertSalesRepsTargets(saleRepsTargetData) {
    return await db.insert(sales_reps_monthly_targets).values(saleRepsTargetData).returning();
  }


}



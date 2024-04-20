import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { sales_reps_monthly_achieves } from 'src/drizzle/schemas/salesRepsMonthlyAchieves';
import { db } from 'src/seeders/db';


@Injectable()
export class SalesRepsTargetsAchivedService {
  insert(data) {
    return db.insert(sales_reps_monthly_achieves).values(data).returning();
  }

  async findAll(queryString) {
    const rawQuery = sql`
            SELECT 
                month,
                CAST(SUM(covid_a) AS INTEGER) AS COVID,
                CAST(SUM(covid_flu_a) AS INTEGER) AS COVID_FLU,
                CAST(SUM(clinical_a) AS INTEGER) AS CLINICAL_CHEMISTRY,
                CAST(SUM(gastro_a) AS INTEGER) AS GASTRO,
                CAST(SUM(nail_a) AS INTEGER) AS NAIL,
                CAST(SUM(pgx_a) AS INTEGER) AS PGX_TEST,
                CAST(SUM(rpp_a) AS INTEGER) AS RESPIRATORY_PANEL,
                CAST(SUM(tox_a) AS INTEGER) AS TOXICOLOGY,
                CAST(SUM(ua_a) AS INTEGER) AS URINALYSIS,
                CAST(SUM(uti_a) AS INTEGER) AS UTI_PANEL,
                CAST(SUM(wound_a) AS INTEGER) AS WOUND,
                CAST(SUM(card_a) AS INTEGER) AS CARDIAC,
                CAST(SUM(cgx_a) AS INTEGER) AS CGX_PANEL,
                CAST(SUM(diabetes_a) AS INTEGER) AS DIABETES,
                CAST(SUM(pad_a) AS INTEGER) AS PAD_ALZHEIMERS,
                CAST(SUM(pul_a) AS INTEGER) AS PULMONARY_PANEL
            FROM sales_reps_monthly_achieves
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
            GROUP BY month;
        `;
    const data = await db.execute(rawQuery);

    return data.rows;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesRepsTargetsAchived`;
  }

  update(id: number) {
    return `This action updates a #${id} salesRepsTargetsAchived`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesRepsTargetsAchived`;
  }
}

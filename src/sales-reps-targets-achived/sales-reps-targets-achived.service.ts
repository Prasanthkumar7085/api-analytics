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

  async findAchivedTargets(filterArray) {
    const placeholders = filterArray.map(({ sales_rep_id, month }) => `(sales_rep_id = ${sales_rep_id} AND month = '${month}')`).join(' OR ');

    const rawQuery = sql`
        SELECT * from sales_reps_monthly_achieves 
        WHERE ${sql.raw(placeholders)};
        `;

    const data = await db.execute(rawQuery);

    return data.rows;
  }

  async updateTargetAchieves(queryString) {

    const rawQuery = sql`
        UPDATE sales_reps_monthly_achieves AS t
        SET
          sales_rep_id = u.salesRepId,
          start_date = u.startDate,
          end_date = u.endDate,
          month = u.month,
          covid_a = u.covidA,
          covid_flu_a = u.covidFluA,
          clinical_a = u.clinicalA,
          nail_a = u.nailA,
          pgx_a = u.pgxA,
          rpp_a = u.rppA,
          tox_a = u.toxA,
          ua_a = u.uaA,
          uti_a = u.utiA,
          wound_a = u.woundA,
          cgx_a = u.cgxA,
          diabetes_a = u.diabetesA,
          pad_a = u.padA,
          pul_a = u.pulA,
          gastro_a = u.gastroA,
          card_a = u.cardA
        FROM(
          VALUES

        ${sql.raw(queryString)}
        ) as u(salesRepId, startDate, endDate, month, covidA, covidFluA, clinicalA, nailA, pgxA, rppA, toxA, uaA, utiA, woundA, cgxA, diabetesA, padA, pulA, gastroA, cardA)
        WHERE t.sales_rep_id = u.salesRepId AND t.month = u.month`;

    return db.execute(rawQuery);
  }


  async getSingleSalesRepTargetVolume(id, queryString) {
    const rawQuery = sql`
        SELECT 
            CONCAT(
                TO_CHAR(TO_DATE(month, 'MM-YYYY'), 'Mon'), 
                ' ', 
                TO_CHAR(TO_DATE(month, 'MM-YYYY'), 'YYYY')
            ) AS month,
            CAST(SUM(total_a) AS INTEGER) AS total_volume
        FROM 
            sales_reps_monthly_achieves
        WHERE 
            sales_rep_id = ${id}
            ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
        GROUP BY 
            month
    `;



    const data = await db.execute(rawQuery);
    return data.rows;
  }


  async getTotalTargetAchievementsMonthWise(queryString) {
    const rawQuery = sql`
                    WITH targets AS (
                                SELECT
                                  sm.sales_rep_id,
                                  s.name AS sales_rep_name,
                                  sm.month AS month,
                                  CAST(SUM(sm.covid_a) AS INTEGER) AS COVID,
                                  CAST(SUM(sm.covid_flu_a) AS INTEGER) AS COVID_FLU,
                                  CAST(SUM(sm.clinical_a) AS INTEGER) AS CLINICAL_CHEMISTRY,
                                  CAST(SUM(sm.gastro_a) AS INTEGER) AS GASTRO,
                                  CAST(SUM(sm.nail_a) AS INTEGER) AS NAIL,
                                  CAST(SUM(sm.pgx_a) AS INTEGER) AS PGX_TEST,
                                  CAST(SUM(sm.rpp_a) AS INTEGER) AS RESPIRATORY_PANEL,
                                  CAST(SUM(sm.tox_a) AS INTEGER) AS TOXICOLOGY,
                                  CAST(SUM(sm.ua_a) AS INTEGER) AS URINALYSIS,
                                  CAST(SUM(sm.uti_a) AS INTEGER) AS UTI_PANEL,
                                  CAST(SUM(sm.wound_a) AS INTEGER) AS WOUND,
                                  CAST(SUM(sm.card_a) AS INTEGER) AS CARDIAC,
                                  CAST(SUM(sm.cgx_a) AS INTEGER) AS CGX_PANEL,
                                  CAST(SUM(sm.diabetes_a) AS INTEGER) AS DIABETES,
                                  CAST(SUM(sm.pad_a) AS INTEGER) AS PAD_ALZHEIMERS,
                                  CAST(SUM(sm.pul_a) AS INTEGER) AS PULMONARY_PANEL
                          FROM sales_reps_monthly_achieves sm
                          JOIN sales_reps s ON sm.sales_rep_id = s.id 
                          ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
                          GROUP BY sm.sales_rep_id,
                                  sm.month,
                                  s.name  
                          
                    )
                    SELECT 
                        sales_rep_id,
                        sales_rep_name,
                        (
                          COVID + COVID_FLU + CLINICAL_CHEMISTRY + GASTRO + NAIL + PGX_TEST + RESPIRATORY_PANEL +
                          TOXICOLOGY + URINALYSIS + UTI_PANEL + WOUND + CARDIAC + CGX_PANEL + DIABETES +
                          PAD_ALZHEIMERS + PULMONARY_PANEL
                        ) AS total_achieves,
                        month
                    FROM targets`;

    const data = await db.execute(rawQuery);

    return data.rows;
  }
}

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
            srt.start_date DESC

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

        const { covid, covid_flu, clinical, gastro, nail, pgx, rpp, tox, ua, uti, wound, card, cgx, diabetes, pad, pul, new_facilities } = salesRepTargetDto;

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
            pul = ${pul},
            new_facilities = ${new_facilities}

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


    async getAllTargetsForSalesRep(id, queryString) {
        const rawQuery = sql`
          SELECT 
              month,
              CAST(SUM(covid) AS INTEGER) AS COVID,
              CAST(SUM(covid_flu) AS INTEGER) AS COVID_FLU,
              CAST(SUM(clinical) AS INTEGER) AS CLINICAL_CHEMISTRY,
              CAST(SUM(gastro) AS INTEGER) AS GASTRO,
              CAST(SUM(nail) AS INTEGER) AS NAIL,
              CAST(SUM(pgx) AS INTEGER) AS PGX_TEST,
              CAST(SUM(rpp) AS INTEGER) AS RESPIRATORY_PANEL,
              CAST(SUM(tox) AS INTEGER) AS TOXICOLOGY,
              CAST(SUM(ua) AS INTEGER) AS URINALYSIS,
              CAST(SUM(uti) AS INTEGER) AS UTI_PANEL,
              CAST(SUM(wound) AS INTEGER) AS WOUND,
              CAST(SUM(card) AS INTEGER) AS CARDIAC,
              CAST(SUM(cgx) AS INTEGER) AS CGX_PANEL,
              CAST(SUM(diabetes) AS INTEGER) AS DIABETES,
              CAST(SUM(pad) AS INTEGER) AS PAD_ALZHEIMERS,
              CAST(SUM(pul) AS INTEGER) AS PULMONARY_PANEL
          FROM sales_reps_monthly_targets
          WHERE sales_rep_id = ${id}
          ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
          GROUP BY month;
        `;
        const data = await db.execute(rawQuery);

        return data.rows;
    }



    async getSingleSalesRepTargetVolume(id, queryString) {
        const rawQuery = sql`
    SELECT 
        CONCAT(
            TO_CHAR(TO_DATE(month, 'MM-YYYY'), 'Mon'), 
            ' ', 
            TO_CHAR(TO_DATE(month, 'MM-YYYY'), 'YYYY')
        ) AS month,
        CAST(SUM(total) AS INTEGER) AS total_target
    FROM 
        sales_reps_monthly_targets
    WHERE 
        sales_rep_id = ${id}
        ${queryString ? sql`AND ${sql.raw(queryString)}` : sql``}
    GROUP BY 
        month
`;

        const data = await db.execute(rawQuery);
        return data.rows;
    }


    async getTargetsStatsForSingleRep(id, queryString) {
        const rawQuery = sql`
        SELECT 
            'COVID' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN covid ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'COVID FLU' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN covid_flu ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'CLINICAL CHEMISTRY' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN clinical ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'GASTRO' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN gastro ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'NAIL' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN nail ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'PGX TEST' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN pgx ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'RESPIRATORY PANEL' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN rpp ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'TOXICOLOGY' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN tox ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'URINALYSIS' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN ua ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'UTI PANEL' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN uti ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'WOUND' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN wound ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'CARDIAC' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN card ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'CGX PANEL' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN cgx ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'DIABETES' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN diabetes ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'PAD ALZHEIMERS' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN pad ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'PULMONARY PANEL' AS case_type_name,
            CAST(SUM(CASE WHEN sales_rep_id = ${id} THEN pul ELSE 0 END) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
            ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
    `;

        const data = await db.execute(rawQuery);
        return data.rows;
    }


    async getTargetsStats(queryString) {
        const rawQuery = sql`
        SELECT 
            'COVID' AS case_type_name,
            CAST(SUM(covid) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'COVID FLU' AS case_type_name,
            CAST(SUM(covid_flu) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'CLINICAL CHEMISTRY' AS case_type_name,
            CAST(SUM(clinical) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'GASTRO' AS case_type_name,
            CAST(SUM(gastro) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'NAIL' AS case_type_name,
            CAST(SUM(nail) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'PGX TEST' AS case_type_name,
            CAST(SUM(pgx) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'RESPIRATORY PANEL' AS case_type_name,
            CAST(SUM(rpp) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'TOXICOLOGY' AS case_type_name,
            CAST(SUM(tox) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'URINALYSIS' AS case_type_name,
            CAST(SUM(ua) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'UTI PANEL' AS case_type_name,
            CAST(SUM(uti) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'WOUND' AS case_type_name,
            CAST(SUM(wound) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'CARDIAC' AS case_type_name,
            CAST(SUM(card) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'CGX PANEL' AS case_type_name,
            CAST(SUM(cgx) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'DIABETES' AS case_type_name,
            CAST(SUM(diabetes) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'PAD ALZHEIMERS' AS case_type_name,
            CAST(SUM(pad) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
        UNION ALL
        SELECT 
            'PULMONARY PANEL' AS case_type_name,
            CAST(SUM(pul) AS INTEGER) AS total_targets
        FROM sales_reps_monthly_targets
        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
    `;

        const data = await db.execute(rawQuery);
        return data.rows;
    }


    async getOverviewVolumeTargetsData(queryString: string) {
        let query = sql`
    SELECT 
        month,
        CAST(SUM(covid) AS INTEGER) AS COVID,
        CAST(SUM(covid_flu) AS INTEGER) AS COVID_FLU,
        CAST(SUM(clinical) AS INTEGER) AS CLINICAL_CHEMISTRY,
        CAST(SUM(gastro) AS INTEGER) AS GASTRO,
        CAST(SUM(nail) AS INTEGER) AS NAIL,
        CAST(SUM(pgx) AS INTEGER) AS PGX_TEST,
        CAST(SUM(rpp) AS INTEGER) AS RESPIRATORY_PANEL,
        CAST(SUM(tox) AS INTEGER) AS TOXICOLOGY,
        CAST(SUM(ua) AS INTEGER) AS URINALYSIS,
        CAST(SUM(uti) AS INTEGER) AS UTI_PANEL,
        CAST(SUM(wound) AS INTEGER) AS WOUND,
        CAST(SUM(card) AS INTEGER) AS CARDIAC,
        CAST(SUM(cgx) AS INTEGER) AS CGX_PANEL,
        CAST(SUM(diabetes) AS INTEGER) AS DIABETES,
        CAST(SUM(pad) AS INTEGER) AS PAD_ALZHEIMERS,
        CAST(SUM(pul) AS INTEGER) AS PULMONARY_PANEL
    FROM sales_reps_monthly_targets
    ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
    GROUP BY 
        month
    ORDER BY 
        month
`;

        const data = await db.execute(query);

        return data.rows;
    }


    async getTotalTargets(queryString) {
        const rawQuery = sql`
                    WITH targets AS (
                        SELECT 
                            sales_rep_id,
                            CAST(SUM(covid) AS INTEGER) AS COVID,
                            CAST(SUM(covid_flu) AS INTEGER) AS COVID_FLU,
                            CAST(SUM(clinical) AS INTEGER) AS CLINICAL_CHEMISTRY,
                            CAST(SUM(gastro) AS INTEGER) AS GASTRO,
                            CAST(SUM(nail) AS INTEGER) AS NAIL,
                            CAST(SUM(pgx) AS INTEGER) AS PGX_TEST,
                            CAST(SUM(rpp) AS INTEGER) AS RESPIRATORY_PANEL,
                            CAST(SUM(tox) AS INTEGER) AS TOXICOLOGY,
                            CAST(SUM(ua) AS INTEGER) AS URINALYSIS,
                            CAST(SUM(uti) AS INTEGER) AS UTI_PANEL,
                            CAST(SUM(wound) AS INTEGER) AS WOUND,
                            CAST(SUM(card) AS INTEGER) AS CARDIAC,
                            CAST(SUM(cgx) AS INTEGER) AS CGX_PANEL,
                            CAST(SUM(diabetes) AS INTEGER) AS DIABETES,
                            CAST(SUM(pad) AS INTEGER) AS PAD_ALZHEIMERS,
                            CAST(SUM(pul) AS INTEGER) AS PULMONARY_PANEL
                        FROM sales_reps_monthly_targets
                        ${queryString ? sql`WHERE ${sql.raw(queryString)}` : sql``}
                        GROUP BY sales_rep_id
                    )
                    SELECT 
                        sales_rep_id,
                        (
                            COVID + COVID_FLU + CLINICAL_CHEMISTRY + GASTRO + NAIL + PGX_TEST + RESPIRATORY_PANEL +
                            TOXICOLOGY + URINALYSIS + UTI_PANEL + WOUND + CARDIAC + CGX_PANEL + DIABETES +
                            PAD_ALZHEIMERS + PULMONARY_PANEL
                        ) AS total_targets
                    FROM targets;
                `;

        const data = await db.execute(rawQuery);

        return data.rows;
    }


    async getTotalTargetsMonthWise(queryString) {
        const rawQuery = sql`
                    WITH targets AS (
                                SELECT
                                    sm.sales_rep_id,
                                    s.name AS sales_rep_name,
                                    sm.month AS month,
                                    CAST(SUM(sm.covid) AS INTEGER) AS COVID,
                                    CAST(SUM(sm.covid_flu) AS INTEGER) AS COVID_FLU,
                                    CAST(SUM(sm.clinical) AS INTEGER) AS CLINICAL_CHEMISTRY,
                                    CAST(SUM(sm.gastro) AS INTEGER) AS GASTRO,
                                    CAST(SUM(sm.nail) AS INTEGER) AS NAIL,
                                    CAST(SUM(sm.pgx) AS INTEGER) AS PGX_TEST,
                                    CAST(SUM(sm.rpp) AS INTEGER) AS RESPIRATORY_PANEL,
                                    CAST(SUM(sm.tox) AS INTEGER) AS TOXICOLOGY,
                                    CAST(SUM(sm.ua) AS INTEGER) AS URINALYSIS,
                                    CAST(SUM(sm.uti) AS INTEGER) AS UTI_PANEL,
                                    CAST(SUM(sm.wound) AS INTEGER) AS WOUND,
                                    CAST(SUM(sm.card) AS INTEGER) AS CARDIAC,
                                    CAST(SUM(sm.cgx) AS INTEGER) AS CGX_PANEL,
                                    CAST(SUM(sm.diabetes) AS INTEGER) AS DIABETES,
                                    CAST(SUM(sm.pad) AS INTEGER) AS PAD_ALZHEIMERS,
                                    CAST(SUM(sm.pul) AS INTEGER) AS PULMONARY_PANEL
                            FROM sales_reps_monthly_targets sm
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
                    ) AS total_targets,
                        month
                        FROM targets`;

        const data = await db.execute(rawQuery);

        return data.rows;
    }

}



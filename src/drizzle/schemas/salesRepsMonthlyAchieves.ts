
import { index, integer, pgTable, serial, date, varchar } from 'drizzle-orm/pg-core';
import { sales_reps } from './salesReps';

export const sales_reps_monthly_achieves = pgTable('sales_reps_monthly_achieves', {
    id: serial('id').primaryKey(),
    salesRepId: integer("sales_rep_id").references(() => sales_reps.id).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    month: varchar('month').notNull(), //"MM-YYYY"
    covidA: integer('covid_a').default(0),
    covidFluA: integer('covid_flu_a').default(0),
    clinicalA: integer('clinical_a').default(0),
    gastroA: integer('gastro_a').default(0),
    nailA: integer('nail_a').default(0),
    pgxA: integer('pgx_a').default(0),
    rppA: integer('rpp_a').default(0),
    toxA: integer('tox_a').default(0),
    uaA: integer('ua_a').default(0),
    utiA: integer('uti_a').default(0),
    woundA: integer('wound_a').default(0),
    cardA: integer('card_a').default(0),
    cgxA: integer('cgx_a').default(0),
    diabetesA: integer('diabetes_a').default(0),
    padA: integer('pad_a').default(0),
    pulA: integer('pul_a').default(0),
    totalA: integer('total_a').default(0),
    newFacilitiesA: integer('new_facilities_a').default(0),
}, (table: any) => {
    return {
        salesRepsMonthlyAchievesSalesRepIdIdx: index("sales_reps_monthly_achieves_sales_rep_id").on(table.salesRepId),
        salesRepsMonthlyAchievesMonthIdx: index("sales_reps_monthly_achieves_month_idx").on(table.month),
        salesRepsMonthlyAchievesStartDateIdx: index("sales_reps_monthly_achieves_start_date_idx").on(table.startDate),
        salesRepsMonthlyAchievesEndDateIdx: index("sales_reps_monthly_achieves_end_date_idx").on(table.endDate),
        salesRepsMonthlyAchievesTotalIdx: index("sales_reps_monthly_achieves_total_idx").on(table.totalA),
    };
});

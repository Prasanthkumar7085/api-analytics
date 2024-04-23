
import { index, integer, pgTable, serial, date, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sales_reps } from './salesReps';


export const sales_reps_monthly_targets = pgTable('sales_reps_monthly_targets', {
    id: serial('id').primaryKey(),
    salesRepId: integer("sales_rep_id").references(() => sales_reps.id).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    month: varchar('month').notNull(),//"MM-YYYY"
    covid: integer('covid').default(0),
    covidFlu: integer('covid_flu').default(0),
    clinical: integer('clinical').default(0),
    gastro: integer('gastro').default(0),
    nail: integer('nail').default(0),
    pgx: integer('pgx').default(0),
    rpp: integer('rpp').default(0),
    tox: integer('tox').default(0),
    ua: integer('ua').default(0),
    uti: integer('uti').default(0),
    wound: integer('wound').default(0),
    card: integer('card').default(0),
    cgx: integer('cgx').default(0),
    diabetes: integer('diabetes').default(0),
    pad: integer('pad').default(0),
    pul: integer('pul').default(0),
    total: integer('total').default(0),
    newFacilities: integer('new_facilities').default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table: any) => {
    return {
        salesRepsMonthlyTargetsSalesRepIdIdx: index("sales_reps_monthly_targets_sales_rep_id").on(table.salesRepId),
        salesRepsMonthlyTargetsMonthIdx: index("sales_reps_monthly_targets_month_idx").on(table.month),
        salesRepsMonthlyTargetsStartDateIdx: index("sales_reps_monthly_targets_start_date_idx").on(table.startDate),
        salesRepsMonthlyTargetsEndDateIdx: index("sales_reps_monthly_targets_end_date_idx").on(table.endDate),
        salesRepsMonthlyTargetsTotalIdx: index("sales_reps_monthly_targets_total_idx").on(table.total),
    };
});

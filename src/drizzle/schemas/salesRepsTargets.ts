
import { index, integer, jsonb, pgTable, serial } from 'drizzle-orm/pg-core';
import { sales_reps } from './salesReps';


export const sales_reps_targets = pgTable('sales_reps_targets', {
    id: serial('id').primaryKey(),
    salesRepId: integer("sales_rep_id").references(() => sales_reps.id).notNull(),
    year: integer('year').notNull(),
    jan: jsonb('jan').$type<number[]>().default([0, 0, 0, 0]),
    feb: jsonb('feb').$type<number[]>().default([0, 0, 0, 0]),
    mar: jsonb('mar').$type<number[]>().default([0, 0, 0, 0]),
    april: jsonb('april').$type<number[]>().default([0, 0, 0, 0]),
    may: jsonb('may').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
    june: jsonb('june').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
    july: jsonb('july').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
    aug: jsonb('aug').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
    sep: jsonb('sep').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
    oct: jsonb('oct').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
    nov: jsonb('nov').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
    dec: jsonb('dec').$type<number[]>().default([0, 0, 0, 0]),// [target_volume,target_facilites,achieved_volume, achieved_facilities]
}, (table: any) => {
    return {
        salesRepsTargetsSalesRepIdIdx: index("sales_reps_targets_sales_rep_id").on(table.salesRepId),
        yearIdx: index("sales_reps_targets_year_idx").on(table.year)
    };
});

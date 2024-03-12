
import { integer, serial, text, pgTable, boolean, varchar, doublePrecision, date } from 'drizzle-orm/pg-core';
import { sales_reps } from './salesReps';



export const facilities = pgTable('facilities', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id'),// mongodbid,
    salesRepId: integer("sales_rep_id").references(() => sales_reps.id),// mongodbid
});
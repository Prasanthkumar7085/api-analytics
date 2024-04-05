
import { index, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { sales_reps } from './salesReps';



export const facilities = pgTable('facilities', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id'),// mongodbid,
    mghRefId: text('mgh_ref_id').default(null),// mongodbid,
    salesRepId: integer("sales_rep_id").default(null).references(() => sales_reps.id)
}, (table: any) => {
    return {
        faciltiesMghRefIdIdx: index("facilties_mgh_ref_id_idx").on(table.mghRefId),
        faciltiesRefIdIdx: index("facilties_ref_id_idx").on(table.refId)
    };
});
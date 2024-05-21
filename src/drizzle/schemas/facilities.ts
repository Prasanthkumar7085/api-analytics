
import { index, integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { sales_reps } from './salesReps';
import { sql } from 'drizzle-orm';

const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);


export const facilities = pgTable('facilities', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id').default(null),// mongodbid,
    mghRefId: text('mgh_ref_id').default(null),// mongodbid,
    salesRepId: integer("sales_rep_id").default(null).references(() => sales_reps.id),
    status: statusEnum('status').default("ACTIVE"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table: any) => {
    return {
        faciltiesMghRefIdIdx: index("facilties_mgh_ref_id_idx").on(table.mghRefId),
        faciltiesRefIdIdx: index("facilties_ref_id_idx").on(table.refId),
        facilitiesStatusIdx: index("facilities_status_idx").on(table.status)
    };
});
import { sql } from 'drizzle-orm';
import { index, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const insurance_payors = pgTable('insurance_payors', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id').default(null),// mongodbid
    mghRefId: text('mgh_ref_id').default(null),// mongodbid
    status: statusEnum('status').default("ACTIVE"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table: any) => {
    return {
        insuranceMghRefIdIdx: index("insurance_mgh_ref_id_idx").on(table.mghRefId),
        insuranceRefIdIdx: index("insurance_ref_id_idx").on(table.refId),
        insuranceStatusIdx: index("insurance_status_idx").on(table.status)
    };
});

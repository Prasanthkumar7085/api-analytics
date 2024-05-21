
import { index, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user_role } from './userRole';
import { sql } from 'drizzle-orm';

const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const sales_reps = pgTable('sales_reps', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id').default(null),// mongodbid
    mghRefId: text('mgh_ref_id').default(null),// mongodbid
    reportingTo: serial('reporting_to'),
    roleId: integer("role_id").references(() => user_role.id),
    email: varchar('email').default(null),
    status: statusEnum('status').default("ACTIVE"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table: any) => {
    return {
        salesRepMghRefIdIdx: index("sales_rep_mgh_ref_id_idx").on(table.mghRefId),
        salesRepRefIdIdx: index("sales_rep_ref_id_idx").on(table.refId),
        sales_repStatusIdx: index("sales_rep_status_idx").on(table.status)
    };
});

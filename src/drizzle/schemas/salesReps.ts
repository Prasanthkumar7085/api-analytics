
import { index, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { user_role } from './userRole';

export const sales_reps = pgTable('sales_reps', {
    id: serial('id').primaryKey(),
    name: text('name'),
    refId: text('ref_id').default(null),// mongodbid
    mghRefId: text('mgh_ref_id').default(null),// mongodbid
    reportingTo: serial('reporting_to'),
    roleId: integer("role_id").references(() => user_role.id),
    email: varchar('email').default(null),
}, (table: any) => {
    return {
        salesRepMghRefIdIdx: index("sales_rep_mgh_ref_id_idx").on(table.mghRefId),
        salesRepRefIdIdx: index("sales_rep_ref_id_idx").on(table.refId)
    };
});
